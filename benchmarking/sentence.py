from sentence_transformers import SentenceTransformer
import numpy as np
import os

def cosine_similarity(sentence_embeddings, ind_a, ind_b):
    s = sentence_embeddings
    return np.dot(s[ind_a], s[ind_b]) / (np.linalg.norm(s[ind_a]) * np.linalg.norm(s[ind_b]))

model = SentenceTransformer('bert-base-nli-mean-tokens')

# s0 = "our president is a good leader he will not fail"
# s1 = "our president is not a good leader he will fail"
# s2 = "our president is a good leader"
# s3 = "our president will succeed"

# sentences = [s0, s1, s2, s3]

# sentence_embeddings = model.encode(sentences)

# s = sentence_embeddings

# print(f"{s0} <--> {s1}: {cosine_similarity(sentence_embeddings, 0, 1)}")
# print(f"{s0} <--> {s2}: {cosine_similarity(sentence_embeddings, 0, 2)}")
# print(f"{s0} <--> {s3}: {cosine_similarity(sentence_embeddings, 0, 3)}")

print("Type in a sentence! \n")
inp = "blank"
while inp != "stop":
    inp = input()
    input_emb = model.encode([inp])
    words = inp.lower().split()
    word_emb = model.encode(words)
    sentence_ranks = []
    for i, w in enumerate(word_emb):
        sentence_ranks.append(np.dot(w, input_emb[0]) / (np.linalg.norm(w) * np.linalg.norm(input_emb[0])))


    html_element = ""
    for i, w in enumerate(sentence_ranks):
        html_element += f"<span style='opacity:{w * 1.3}'>{words[i]} </span>"

    print(f"""\
Content-Type: text/html

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Hello from a CGI Script</title>
  <style>
  </style>
</head>
<body>
   {html_element} 
</body>
</html>""")
