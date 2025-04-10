import os
from flask import Flask, redirect, render_template, request, jsonify
from PIL import Image
import torchvision.transforms.functional as TF
import numpy as np
import torch
import pandas as pd
import torch.nn as nn
from torchvision import transforms
import torchvision.models as models
disease_info = pd.read_csv('datasets/disease_info.csv' , encoding='cp1252')
supplement_info = pd.read_csv('datasets/supplement_info.csv',encoding='cp1252')
class TempModel(nn.Module):
    def __init__(self):
        super(TempModel, self).__init__()
        self.conv1 = nn.Conv2d(3, 5, (3, 3))

    def forward(self, inp):
        return self.conv1(inp)

model = models.resnet50(pretrained=False)
# Modify the final layer to match 39 output classes
model.fc = nn.Linear(model.fc.in_features, 39)
model.load_state_dict(torch.load("models/trained_model.pth"))
model.eval()

transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
])

def predict(img_path):
    try:
        img = Image.open(img_path)
        img = transform(img)

        with torch.no_grad():
            output = model(img.unsqueeze(0))
            predicted_class = torch.argmax(output)

        return predicted_class.item()

    except Exception as e:
        return str(e)


app = Flask(__name__)

@app.route('/submit', methods=['GET', 'POST'])
def submit():
    if request.method == 'POST':
        image = request.files['image']
        filename = image.filename
        file_path = os.path.join('public','uploads', filename)
        image.save(file_path)
        print(file_path)
        pred = predict(file_path)  # Call the predict function here
        title = disease_info['disease_name'][pred]
        description = disease_info['description'][pred]
        prevent = disease_info['Possible Steps'][pred]
        image_url = disease_info['image_url'][pred]
        supplement_name = supplement_info['supplement name'][pred]
        supplement_image_url = supplement_info['supplement image'][pred]
        supplement_buy_link = supplement_info['buy link'][pred]
        return render_template('test.html', title=title, desc=description, prevent=prevent,
                               image_url=image_url, pred=pred, sname=supplement_name, simage=supplement_image_url, buy_link=supplement_buy_link)
    return render_template('test.html')


if __name__ == '__main__':
    app.run(debug=True)