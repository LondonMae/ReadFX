from flask import Flask, jsonify, request # BACKEND FRAMEWORK
import torch # for gpu training
from transformers import BartTokenizerFast, T5ForConditionalGeneration, BartForConditionalGeneration, BartTokenizer, BartConfig #for summarization
from rake_nltk import Rake # to identify keywords
import nltk
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
import json

from collections import defaultdict
from gensim import corpora
from gensim import models
from gensim import similarities

import numpy as np


# tokenize the highlighted text
# https://huggingface.co/docs/transformers/v4.37.2/en/model_doc/bart#transformers.BartTokenizer
tokenizer=BartTokenizer.from_pretrained('facebook/bart-large-cnn')
# Conditional generation is best for summarization
model=BartForConditionalGeneration.from_pretrained('facebook/bart-large-cnn')

app = Flask(__name__)

limiter = Limiter(
    app=app,
    key_func=get_remote_address,
    default_limits=["200 per day", "50 per hour"],
    storage_uri = "memory://"
)
# configure gpu device if available
device = "cuda:0" if torch.cuda.is_available() else "cpu"
print(device)

def topic_analysis(selected, data):
    documents = data

    doc = selected

    # remove common words and tokenize
    stoplist = set('for a of the and to in'.split())
    texts = [
        [word for word in document.lower().split() if word not in stoplist]
        for document in documents
    ]

    # remove words that appear only once
    frequency = defaultdict(int)
    for text in texts:
        for token in text:
            frequency[token] += 1

    texts = [
        [token for token in text if frequency[token] > 1]
        for text in texts
    ]

    dictionary = corpora.Dictionary(texts)
    corpus = [dictionary.doc2bow(text) for text in texts]

    lsi = models.LsiModel(corpus, id2word=dictionary)

    vec_bow = dictionary.doc2bow(doc.lower().split())
    print(vec_bow)
    vec_lsi = lsi[vec_bow]  # convert the query to LSI space

    index = similarities.MatrixSimilarity(lsi[corpus])  # transform corpus to LSI space and index it
    print(index)


    sims = index[vec_lsi]  # perform a similarity query against the corpus
    test = list(enumerate(sims))  # print (document_number, document_similarity) 2-tuples

    scores = []
    for pos, score in test:
        scores.append(score)

    mean = np.mean(scores)
    sd = np.std(scores)


    ret = []
    count = 0
    avg = 0
    sims = sorted(enumerate(sims), key=lambda item: -item[1])
    for doc_position, doc_score in sims:
        if doc_score > .3:
            print(doc_score, documents[doc_position])
            ret.append(doc_position)
            count +=1
    #
    # print("avg score = " + str(avg/len(documents)))


    # print("\n ", selected)

    return ret


def summarize(data):
    ARTICLE = data

    # Transmitting the encoded inputs to the model.generate() function
    inputs = tokenizer.batch_encode_plus([ARTICLE],return_tensors='pt', return_length=True).to(device)
    # length of tokens, not chars
    length = inputs['length']

    # simple bounds checking
    if length < 20:
        summary = "This text is too short to summarize"
    elif length > 1024:
        summary = "This text is too long to summarize"
    else:
        summary_ids =  model.generate(inputs['input_ids'], num_beams=4, min_length=int(length*.1), max_length=int(length*.5)).to(device)
        # Decoding summary
        summary = tokenizer.decode(summary_ids[0], skip_special_tokens=True)
    return summary

def get_keywords(text):
    r = Rake()
    r.extract_keywords_from_text(text)
    b=r.get_ranked_phrases_with_scores()
    return_string = ""


    tokens = nltk.tokenize.word_tokenize(text)
    print(len(tokens))

    val = 12.0
    min_val = 5.0
    if (len(tokens) > 5000):
        val -= len(tokens)*.0006
    else:
        val -= len(tokens)*.0003
    chosen_words = set()
    for score in b:
        if score[0] > val:
            if score[1] not in chosen_words:
                chosen_words.add(score[1])
                return_string += score[1] + "/"

    if val < min_val:
        val = min_val

    return return_string

@app.route("/v0/summary", methods = ["POST"])
@limiter.limit("1/5seconds")
def summary():
    """Return a friendly HTTP greeting."""
    # post request with JSON data format
    content = request.get_json()
    print(content)
    # get summary if available
    summary = summarize(content)

    # json-ifyable format
    data = {
    "summary": summary,
    "raw": "Successful"
    }

    print(summary)
    # return data
    return jsonify(data)

@app.route("/v0/similarity", methods = ["POST"])
@limiter.limit("1/5seconds")
def similarity():
    """Return a friendly HTTP greeting."""
    # post request with JSON data format
    content = request.get_json()

    selected = content[0]
    content.pop(0)

    ret = topic_analysis(selected, content)
    print(ret)


    data = {
    "summary": json.dumps(ret),
    "raw": "Successful"
    }

    return data


@app.route("/v0/keywords", methods = ["POST"])
@limiter.limit("1/10seconds")
def keywords():
    """Return a friendly HTTP greeting."""
    # post request with JSON data format
    content = request.get_json()

    # get summary if available
    keyword = get_keywords(content)

    # json-ifyable format
    data = {
    "summary": keyword,
    "raw": "Successful"
    }

    # return data
    return jsonify(data)

if __name__ == "__main__":
    # Used when running locally only. When deploying to Google App
    # Engine, a webserver process such as Gunicorn will serve the app. This
    # can be configured by adding an `entrypoint` to app.yaml.
    app.run(host = "0.0.0.0", port=8000, debug=True)
