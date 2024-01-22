from django.shortcuts import render

import json
from django.contrib.auth.models import User #####
from django.http import JsonResponse , HttpResponse ####

import wikipedia

# Importing the model
from transformers import BartForConditionalGeneration, BartTokenizer, BartConfig

def index(request):
    return HttpResponse("Hello World, you are at wiki index.")

def get_wiki_summary(request):
    topic = request.GET.get("topic", None)

    print("topic:", topic)

    ARTICLE = topic

    tokenizer=BartTokenizer.from_pretrained('facebook/bart-large-cnn')
    model=BartForConditionalGeneration.from_pretrained('facebook/bart-large-cnn')

    # Transmitting the encoded inputs to the model.generate() function
    inputs = tokenizer.batch_encode_plus([ARTICLE],return_tensors='pt')
    summary_ids =  model.generate(inputs['input_ids'], num_beams=4, max_length=150, early_stopping=True)

    print(tokenizer)

    # Decoding and printing the summary
    summary = tokenizer.decode(summary_ids[0], skip_special_tokens=True)
    print(summary)

    data = {
    "summary": summary,
    "raw": "Successful"
    }

    # print("json to be sent: ". data)

    return JsonResponse(data)
