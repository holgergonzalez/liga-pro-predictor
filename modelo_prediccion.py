import numpy as np
import pandas as pd

def predecir_partido_final(home_team, away_team, season_actual, clf_model, scalador, regresores_dict, label_encs, datos):
    # Normalización de nombres
    datos['home_team_name_lower'] = datos['home_team_name'].astype(str).str.lower().str.strip()
    datos['away_team_name_lower'] = datos['away_team_name'].astype(str).str.lower().str.strip()
    home_team_norm = home_team.lower().strip()
    away_team_norm = away_team.lower().strip()

    # Buscar datos del equipo local y visitante
    home_match = datos[datos['home_team_name_lower'] == home_team_norm]
    away_match = datos[datos['away_team_name_lower'] == away_team_norm]

    if home_match.empty or away_match.empty:
        raise ValueError(f"No se encontraron datos para {home_team} o {away_team}")

    # Usar promedio de registros si hay varios
    home = home_match.mean(numeric_only=True)
    away = away_match.mean(numeric_only=True)

    # Preparar entrada para el modelo
    entrada = {
        'home_team_name': label_encs['home_team_name'].transform([home_team])[0],
        'away_team_name': label_encs['away_team_name'].transform([away_team])[0],
        'league_name': label_encs['league_name'].transform([home_match.iloc[0]['league_name']])[0],
        'season': season_actual,
        'home_avg_corners': home['home_avg_corners'],
        'home_avg_yellow_cards': home['home_avg_yellow_cards'],
        'home_avg_red_cards': home['home_avg_red_cards'],
        'away_avg_corners': away['away_avg_corners'],
        'away_avg_yellow_cards': away['away_avg_yellow_cards'],
        'away_avg_red_cards': away['away_avg_red_cards'],
        'total_avg_corners': (home['home_avg_corners'] + away['away_avg_corners']) / 2,
        'total_avg_yellow_cards': (home['home_avg_yellow_cards'] + away['away_avg_yellow_cards']) / 2,
        'total_avg_red_cards': (home['home_avg_red_cards'] + away['away_avg_red_cards']) / 2
    }

    entrada_df = pd.DataFrame([entrada])
    entrada_scaled = scalador.transform(entrada_df)

    # Paso 1: predecir resultado con modelo de clasificación
    resultado_pred = clf_model.predict(entrada_scaled)[0]

    # Si es empate, solo devolvemos eso
    if resultado_pred == "D":
        return {
            'resultado_modelo': "D",
            'detalle': "Empate detectado. No se generan goles ni estadísticas."
        }

    # Paso 2: predecir estadísticas con regresores
    estadisticas_crudas = {}
    for col, modelo in regresores_dict.items():
        estadisticas_crudas[col] = modelo.predict(entrada_scaled)[0]

    # Goles con distribución Poisson
    home_g = np.random.poisson(estadisticas_crudas['home_goals_norm'])
    away_g = np.random.poisson(estadisticas_crudas['away_goals_norm'])

    # Forzar consistencia entre resultado_modelo y goles simulados
    if resultado_pred == "H":
        if home_g <= away_g:
            home_g = away_g + np.random.randint(1, 3)
    elif resultado_pred == "A":
        if away_g <= home_g:
            away_g = home_g + np.random.randint(1, 3)

    # Simulación realista con algo de aleatoriedad (ruido normal)
    yellow_cards = max(0, int(np.random.normal(estadisticas_crudas['total_avg_yellow_cards'] / 10, 1)))
    red_cards = max(0, int(np.random.normal(estadisticas_crudas['total_avg_red_cards'] / 10, 0.5)))
    corners = max(0, int(np.random.normal(estadisticas_crudas['total_avg_corners'] / 10, 1.5)))

    return {
        'resultado_modelo': resultado_pred,
        'home_goals': home_g,
        'away_goals': away_g,
        'yellow_cards': yellow_cards,
        'red_cards': red_cards,
        'corners': corners
    }
