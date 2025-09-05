# 1. Use the official TensorFlow image with GPU support as our base.
#    This is the most stable and reliable choice for an NVIDIA GPU setup.
FROM tensorflow/tensorflow:2.13.0-gpu

# 2. Set the default working directory inside the container.
WORKDIR /code

# 3. Copy our lean, pinned requirements file. This layer is cached.
COPY ./requirements.txt /code/requirements.txt

# 4. Install our Python dependencies. This will now succeed as we have
#    removed the packages that required the failing system-level libraries.
RUN pip install --no-cache-dir -r /code/requirements.txt

# 5. Create a dedicated, non-root user for enhanced security.
RUN useradd -ms /bin/bash appuser

# 6. Copy the rest of your application code into the container.
COPY . /code

# 7. Change the ownership of the code directory to our new user.
RUN chown -R appuser:appuser /code

# 8. Switch the context to run as the new non-root user.
USER appuser

# 9. Specify the default command to start the application.
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]

