import numpy as np
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_absolute_error


def predict_attendance_and_risk(attendance_list):
    """
    attendance_list example:
    [1,0,1,1,1,0,1,0...]

    Predicts next week attendance %
    using Random Forest on rolling attendance windows.
    """

    if len(attendance_list) < 10:
        return None, None, None, None

    X = []
    y = []

    # Create rolling windows of 5 records
    for i in range(len(attendance_list) - 5):
        X.append(attendance_list[i:i+5])
        y.append(attendance_list[i+5])

    X = np.array(X)
    y = np.array(y)

    model = RandomForestRegressor(
        n_estimators=100,
        random_state=42
    )

    model.fit(X, y)

    train_preds = model.predict(X)
    mae = mean_absolute_error(y, train_preds)

    # Predict next 7 attendance values iteratively
    recent_window = attendance_list[-5:].copy()
    future_preds = []

    for _ in range(7):
        pred = model.predict([recent_window])[0]

        pred = max(0, min(1, pred))

        future_preds.append(pred)

        recent_window.pop(0)
        recent_window.append(pred)

    predicted_percentage = np.mean(future_preds) * 100

    # Risk Logic
    if predicted_percentage < 50:
        risk = "High Risk"
    elif predicted_percentage < 75:
        risk = "Medium Risk"
    else:
        risk = "Low Risk"

    accuracy = (1 - mae) * 100

    return (
        round(predicted_percentage, 2),
        risk,
        round(accuracy, 2),
        round(mae, 4)
    )