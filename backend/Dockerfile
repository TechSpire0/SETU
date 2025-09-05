# 1. Use an official NVIDIA CUDA image that is multi-arch as the base.
#    This provides the necessary GPU drivers and libraries.
FROM nvidia/cuda:12.1.0-base-ubuntu22.04

# 2. Set the working directory.
WORKDIR /code

# 3. Install a newer version of Python and essential build tools.
#    - We now install PyGObject and Cairo bindings directly from APT to avoid compilation errors.
ENV DEBIAN_FRONTEND=noninteractive
RUN apt-get update && apt-get install -y software-properties-common && \
    add-apt-repository ppa:deadsnakes/ppa && \
    apt-get update && apt-get install -y \
    python3.11 \
    python3.11-dev \
    python3.11-distutils \
    python3-pip \
    python3-apt \
    pkg-config \
    build-essential \
    git \
    libgirepository1.0-dev \
    libdbus-1-dev \
    libgl1-mesa-glx \
    gobject-introspection \
    libffi-dev \
    libglib2.0-dev \
    libgtk-3-dev \
    python3-gi \
    python3-gi-cairo \
    && rm -rf /var/lib/apt/lists/* \
    && ln -sf /usr/bin/python3.11 /usr/bin/python3

# 4. Copy ONLY the requirements file first to leverage Docker's cache.
COPY ./requirements.txt /code/requirements.txt

# 5. Install Python dependencies using the new Python 3.11.
#    - NOTE: PyGObject and pycairo should be REMOVED from requirements.txt
RUN curl -sS https://bootstrap.pypa.io/get-pip.py | python3 && \
    python3 -m pip install --no-cache-dir --upgrade pip && \
    python3 -m pip install --no-cache-dir -r /code/requirements.txt

# 6. Copy the rest of your application code.
COPY . /code

# 7. Create a non-root user and switch to it for better security.
RUN useradd -m appuser
USER appuser

# 8. Specify the default command to execute when the container starts.
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]

