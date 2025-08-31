import tensorflow as tf
from PIL import Image
import numpy as np
import io
import os

class OtolithClassifier:
    _model = None
    _class_names = None # <-- ADD THIS

    def _load_model(self):
        """
        Loads the trained TensorFlow model and class names.
        """
        print("--- LOADING TRAINED MODEL ---")
        # 1. Load the Keras model from the .h5 file.
        model_path = os.path.join(os.path.dirname(__file__), 'otolith_classifier_model.h5')
        self._model = tf.keras.models.load_model(model_path)

        # 2. IMPORTANT: Define the class mapping in the correct order.
        #    This must match the alphabetical order of the sub-folders
        #    in your 'otolith_dataset' directory.
        self._class_names = ['Gadus_morhua', 'Sardinella_longiceps']
        print("--- MODEL LOADED SUCCESSFULLY ---")

    def get_model_and_classes(self):
        """
        Public method to access the model and class names, loading them once.
        """
        if self._model is None:
            self._load_model()
        return self._model, self._class_names

    def predict(self, image_bytes: bytes) -> dict:
        """
        Performs a prediction on a given image.
        """
        # 3. Get the model and class names.
        model, class_names = self.get_model_and_classes()

        # 4. Pre-process the image (same as before).
        img = Image.open(io.BytesIO(image_bytes)).convert('RGB') # Ensure 3 channels
        img = img.resize((224, 224))
        img_array = tf.keras.utils.img_to_array(img)
        img_array = img_array / 255.0 # Normalize pixel values
        img_array = tf.expand_dims(img_array, 0)

        # 5. Use the real model to make a prediction.
        predictions = model.predict(img_array)
        score = tf.nn.softmax(predictions[0])

        # 6. Get the predicted class name and confidence score.
        predicted_class = class_names[np.argmax(score)]
        confidence_score = 100 * np.max(score)

        return {
            "predicted_species": predicted_class.replace("_", " "),
            "confidence_score": round(confidence_score, 2)
        }

# Create a single, global instance of the classifier.
otolith_classifier = OtolithClassifier()