# Welcome to the ReadFX repository

The following documentation will walk you through how use/develop various parts of the chrome extension
1. [go to](#Chrome-extension-and-developer-mode) Chrome extension and developer mode

2. [go to](#backend/flask) Backend/API usage (Flask)

3. [go to](#large-language-models) HuggingFace Models

4. [go to](#examples) Examples

## Chrome extension and developer mode
[see](https://developer.chrome.com/docs/extensions) Chrome for developers documentations

To load chrome extension in developer mode, go to __manage extensions__ in chrome browser, click __load unpacked__, and select the __src-unpack-to-chrome__ folder in this repository 

To open the sidepanel, right click on a webpage and select the __summarize__ option

## Backend/Flask
We decided to migrate from Django to Flask for lightweight API support because our extension does not require a database or other features offered by Django

to test flask developement backend, run ```python3 backend/main.py```. See documentation [here](https://flask.palletsprojects.com/en/3.0.x/)

We have a production server on Google Cloud. While still in the developement process, we have shut down our virtual machine to save money :)

Eventually, we will need to deploy with Gunicorn. See documentation [here](https://flask.palletsprojects.com/en/3.0.x/deploying/gunicorn/)

### API usage
When the server is running, you can make post requests to the server. Our application currently supports two API calls, (1) Summary and (2) Keywords.
1. To summarize data, send a json object as a POST request to http://localhost:8000/api/get_wiki_summary.
2. To get keywords, send a json object as a POST request to http://localhost:8000/api/get_wiki_keywords.

Both Summary() and Keywords() returns a JSON object, with desired data in the "summary" key.

to test django developement backend (no longer supported/upkept), run ```python3 manage.py runserver```. See documentation [here](https://docs.djangoproject.com/en/5.0/intro/tutorial01/)

## Large Language Models

You can run tests locally in the banchmark folder. Our API currently deployed BART finetuned for conditional generate to summarize text, rake-nltk to select keywords from text, and Gensim to support topic extraction. 

#### BART
Bart takes a significant amount of time to load. We are hoping to include GPU instances on our cloud machine to speed up the predication process. However, if this is either computationally or monetarily expensive, we will consider using __extractive__ summarization. These techniques are lightweight, as they construct summaries by aggregating the most important sentences rather than constructing new ones using large neural netwroks/transformer models. We will address the tradeoffs and look at the performance decline of extractive models. 

#### Rake-nltk
Rake is for rapid keyword extraction. This is a lightweight package that returns the most relevant keywords and their respective score. Javascript has an implementation, but we are currently running this algorithm in the cloud through our API

## Examples

