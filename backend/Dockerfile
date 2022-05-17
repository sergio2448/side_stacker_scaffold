FROM python:3.9

COPY . /app
WORKDIR /app

RUN pip3 install -r requirements.txt --no-cache-dir
RUN pip3 install -r requirements_test.txt --no-cache-dir

EXPOSE 8080 8080

CMD ["python3", "src/side_stacker/sanic_app.py"]
