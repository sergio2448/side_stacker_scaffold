FROM python:3.8

COPY . /app
WORKDIR /app
RUN pip3 install -r requirements.txt --no-cache-dir
RUN pip3 install -r requirements_test.txt --no-cache-dir

CMD ["python3", "run.py", "--host=0.0.0.0", "--port=8080"]
