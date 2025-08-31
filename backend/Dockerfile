# 1. Use the official TensorFlow image with GPU support as our base.
FROM tensorflow/tensorflow:2.13.0-gpu

# 2. Set the default working directory inside the container.
WORKDIR /code

# --- NEW STEP: Install System-Level Dependencies ---
# 3. Before installing Python packages, we must install the C libraries they depend on.
#    - `apt-get update`: Refreshes the list of available system packages.
#    - `apt-get install -y ...`: Installs the packages without asking for confirmation.
#    - `libcairo2-dev`: The development files for the Cairo graphics library, required by pycairo.
#    - `pkg-config`: A helper tool that allows build systems to find C libraries. The error log mentioned this was missing.
RUN apt-get update && apt-get install -y \
    libcairo2-dev \
    pkg-config

# 4. Copy ONLY the requirements file first to leverage Docker's cache.
COPY ./requirements.txt /code/requirements.txt

# 5. Now, run the pip install command. This will now succeed because the
#    underlying 'cairo' library is present on the system.
RUN pip install --no-cache-dir -r /code/requirements.txt

# 6. Finally, copy the rest of your application code.
COPY . /code

# 7. Specify the default command to execute when the container starts.
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]