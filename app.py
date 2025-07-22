from flask import Flask, render_template, request, jsonify
import joblib
import random
import pandas as pd
from modelo_prediccion import predecir_partido_final

app = Flask(__name__)

# Cargar el modelo y encoders
modelo = joblib.load("modelo_clasificacion.pkl")
regresores = joblib.load("regresores.pkl")
scaler = joblib.load("scaler.pkl")
label_encoders = joblib.load("label_encoders.pkl")
data = pd.read_excel("dataset_final_merged.xlsx", sheet_name="Sheet1")

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/predecir", methods=["POST"])
@app.route("/predecir", methods=["POST"])
def predecir():
    datos = request.json
    home_team = datos.get("home_team")
    away_team = datos.get("away_team")
    season_actual = datos.get("season", 2020)  # Por defecto 2020

    try:
        resultado = predecir_partido_final(
            home_team=home_team,
            away_team=away_team,
            season_actual=season_actual,
            clf_model=modelo,
            scalador=scaler,
            regresores_dict=regresores,
            label_encs=label_encoders,
            datos=data
        )
        return jsonify(resultado)
    except Exception as e:
        return jsonify({"error": str(e)}), 400

if __name__ == "__main__":
    app.run(debug=True)

#pip install flask joblib pandas 
#python app.py