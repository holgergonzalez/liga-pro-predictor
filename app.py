#pip install flask joblib
#pip install scikit-learn
#python app.py
from flask import Flask, render_template, request, jsonify
import joblib
import random

app = Flask(__name__)

# Cargar el modelo y encoders
modelo = joblib.load("modelo_entrenado.pkl")
le_home = joblib.load("le_home.pkl")
le_away = joblib.load("le_away.pkl")
le_winner = joblib.load("le_winner.pkl")

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/predecir", methods=["POST"])
@app.route("/predecir", methods=["POST"])
def predecir():
    data = request.get_json()
    equipo1 = data.get("equipo1")
    equipo2 = data.get("equipo2")

    try:
        entrada = [[
            le_home.transform([equipo1])[0],
            le_away.transform([equipo2])[0],
            2025
        ]]
        pred = modelo.predict(entrada)[0]
        resultado = le_winner.inverse_transform([pred])[0].upper()

        if resultado == 'HOME':
            ganador = equipo1
        elif resultado == 'AWAY':
            ganador = equipo2
        else:
            ganador = 'Empate'

        goles_estimados = round(random.uniform(1.5, 4.0), 1)
        tarjetas_estimadas = random.randint(3, 8)
        corners_estimados = random.randint(4, 12)

        return jsonify({
            "resultado": ganador,
            "goles": goles_estimados,
            "tarjetas": tarjetas_estimadas,
            "corners": corners_estimados
        })

    except Exception:
        return jsonify({"error": "Error al predecir. Verifica los nombres de los equipos."}), 400

if __name__ == "__main__":
    app.run(debug=True)
