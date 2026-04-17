import numpy as np
from sklearn.linear_model import LinearRegression, LogisticRegression
from sklearn.metrics import accuracy_score, mean_absolute_error

def predict_attendance_and_risk(attendance_list):
    """
    attendance_list = [1, 0, 1, 1, 0 ...]
    """

    if len(attendance_list) < 5:
        return None, None, None, None

    # -------------------------------
    # 🔵 LINEAR REGRESSION (Predict %)
    # -------------------------------
    X = np.array(range(len(attendance_list))).reshape(-1, 1)
    y = np.array(attendance_list)

    linear_model = LinearRegression()
    linear_model.fit(X, y)

    # Predict next 7 days
    future_days = np.array(
        range(len(attendance_list), len(attendance_list) + 7)
    ).reshape(-1, 1)

    predictions = linear_model.predict(future_days)

    predicted_percentage = np.mean(predictions) * 100
    predicted_percentage = max(0, min(100, predicted_percentage))

    # ✅ MAE (regression metric)
    train_preds = linear_model.predict(X)
    mae = mean_absolute_error(y, train_preds)

    # --------------------------------
    # 🔴 LOGISTIC REGRESSION (Risk ML)
    # --------------------------------

    labels = []

    for val in attendance_list:
        if val == 1:
            labels.append(2)  # Low Risk
        else:
            labels.append(0)  # High Risk

    if len(set(labels)) < 2:
        risk = "Medium Risk"
        accuracy = 1.0   # default (no variation)
    else:
        X_log = X
        y_log = np.array(labels)

        log_model = LogisticRegression()
        log_model.fit(X_log, y_log)

        # ✅ Accuracy calculation
        train_pred = log_model.predict(X_log)
        accuracy = accuracy_score(y_log, train_pred)

        # Predict next
        next_day = np.array([[len(attendance_list)]])
        pred_class = log_model.predict(next_day)[0]

        if pred_class == 0:
            risk = "High Risk"
        elif pred_class == 1:
            risk = "Medium Risk"
        else:
            risk = "Low Risk"

    return predicted_percentage, risk, accuracy, mae