from flask import Flask, jsonify, request # BACKEND FRAMEWORK
import torch # for gpu training
from transformers import BartTokenizerFast, T5ForConditionalGeneration, BartForConditionalGeneration, BartTokenizer, BartConfig #for summarization
from rake_nltk import Rake # to identify keywords
# from keyphrase_vectorizers import KeyphraseCountVectorizer
from keybert import KeyBERT
import nltk

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

def keyword_init():
    nltk.download('stopwords')
    nltk.download('punkt')
    print("download word db")

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

    words = set()
    for score in b:
        if score[0] > 6.0:
            if score[1] not in words:
                words.add(score[1])
                return_string += score[1] + "/"

    print(return_string)
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
    keyword_init()
    app.run(host = "0.0.0.0", port=8000, debug=True)
