# 1. Import all necessary libraries
import tensorflow as tf
from tensorflow.keras.preprocessing.image import ImageDataGenerator
from tensorflow.keras.applications import MobileNetV2
from tensorflow.keras.layers import Dense, GlobalAveragePooling2D
from tensorflow.keras.models import Model
import os

# --- Configuration ---
# 2. Define the configuration variables for our training process.
DATASET_PATH = 'ml_model_data/otolith_dataset'
IMG_SIZE = (224, 224)
BATCH_SIZE = 8 # Small batch size for a small dataset
NUM_EPOCHS = 15 # Number of times to train on the full dataset
MODEL_SAVE_PATH = 'app/ml/otolith_classifier_model.h5'

def train():
    """
    This function handles the entire model training process.
    """
    print("--- Starting Model Training ---")

    # 3. Set up the data augmentation and loading pipeline.
    #    ImageDataGenerator is a powerful tool for loading and augmenting images.
    train_datagen = ImageDataGenerator(
        rescale=1./255,         # Normalize pixel values to be between 0 and 1
        validation_split=0.2,   # Use 20% of the data for validation
        rotation_range=20,      # Randomly rotate images
        width_shift_range=0.2,  # Randomly shift images horizontally
        height_shift_range=0.2, # Randomly shift images vertically
        shear_range=0.2,        # Apply shear transformations
        zoom_range=0.2,         # Randomly zoom in on images
        horizontal_flip=True,   # Randomly flip images horizontally
        fill_mode='nearest'
    )

    # 4. Create the training data generator.
    train_generator = train_datagen.flow_from_directory(
        DATASET_PATH,
        target_size=IMG_SIZE,
        batch_size=BATCH_SIZE,
        class_mode='categorical', # For multi-class classification
        subset='training'       # Specify this is the training set
    )

    # 5. Create the validation data generator.
    validation_generator = train_datagen.flow_from_directory(
        DATASET_PATH,
        target_size=IMG_SIZE,
        batch_size=BATCH_SIZE,
        class_mode='categorical',
        subset='validation'     # Specify this is the validation set
    )
    
    # 6. Load the pre-trained MobileNetV2 model.
    #    'include_top=False' means we don't include the final classification layer.
    base_model = MobileNetV2(weights='imagenet', include_top=False, input_shape=(224, 224, 3))

    # 7. Freeze the layers of the base model.
    #    We don't want to re-train the expert knowledge.
    for layer in base_model.layers:
        layer.trainable = False

    # 8. Add our custom classification layers on top.
    x = base_model.output
    x = GlobalAveragePooling2D()(x)
    x = Dense(128, activation='relu')(x)
    # The final output layer must have as many neurons as we have classes.
    num_classes = len(train_generator.class_indices)
    predictions = Dense(num_classes, activation='softmax')(x)

    # 9. Create the final model.
    model = Model(inputs=base_model.input, outputs=predictions)

    # 10. Compile the model.
    model.compile(optimizer='adam', loss='categorical_crossentropy', metrics=['accuracy'])

    print("--- Model Compiled. Starting Training ---")
    
    # 11. Train the model.
    model.fit(
        train_generator,
        epochs=NUM_EPOCHS,
        validation_data=validation_generator
    )

    print("--- Training Complete. Saving Model ---")

    # 12. Save the trained model to the specified path.
    model.save(MODEL_SAVE_PATH)
    print(f"Model saved to {MODEL_SAVE_PATH}")

if __name__ == "__main__":
    # Ensure the target directory for the model exists.
    os.makedirs(os.path.dirname(MODEL_SAVE_PATH), exist_ok=True)
    train()