FROM jasonm2/bdc_django:arm64-v1.0.2
ENV PYTHONUNBUFFERED 1

RUN apt-get update && apt-get install --yes postgresql postgresql-contrib gcc build-essential libssl-dev libffi-dev python-dev

RUN mkdir -p /bdc_code
WORKDIR /bdc_code
COPY requirements/new_requirements.txt /bdc_code/
RUN pip install -r new_requirements.txt
COPY . /bdc_code/
