import flask
import torch
from transformers import BartTokenizerFast, T5ForConditionalGeneration, BartForConditionalGeneration, BartTokenizer, BartConfig

# If `entrypoint` is not defined in app.yaml, App Engine will look for an app
# called `app` in `main.py`.
app = flask.Flask(__name__)

device = "cuda:0" if torch.cuda.is_available() else "cpu"
print(device)
def test(data):
    # ARTICLE = topic
    ARTICLE = data

    tokenizer=BartTokenizer.from_pretrained('facebook/bart-large-cnn')
    model=BartForConditionalGeneration.from_pretrained('facebook/bart-large-cnn')

    # Transmitting the encoded inputs to the model.generate() function
    inputs = tokenizer.batch_encode_plus([ARTICLE],return_tensors='pt', return_length=True).to(device)
    length = inputs['length']

    summary_ids =  model.generate(inputs['input_ids'], num_beams=4, min_length=int(length*.1), max_length=int(length)).to(device)

    # Decoding and printing the summary
    summary = tokenizer.decode(summary_ids[0], skip_special_tokens=True)
    return summary



@app.get("/<name>")
def hello(name):
    """Return a friendly HTTP greeting."""

    who = test(name)
    return who


if __name__ == "__main__":
    # Used when running locally only. When deploying to Google App
    # Engine, a webserver process such as Gunicorn will serve the app. This
    # can be configured by adding an `entrypoint` to app.yaml.
    app.run(host = "0.0.0.0", port=8000, debug=True)
