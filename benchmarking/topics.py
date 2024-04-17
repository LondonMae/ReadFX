from collections import defaultdict
from gensim import corpora
from gensim import models
# from gensim import similarities
from gensim.models import LdaModel


documents = [
    "Human machine interface for lab abc computer applications, and A survey of user opinion of computer system response time",
    "Albert Einstein (1879–1955) is well known as the most prominent physicist of the twentieth century. His contributions to twentieth-century philosophy of science, though of comparable importance, are less well known. Einstein’s own philosophy of science is an original synthesis of elements drawn from sources as diverse as neo-Kantianism, conventionalism, and logical empiricism, its distinctive feature being its novel blending of realism with a holist, underdeterminationist form of conventionalism. Of special note is the manner in which Einstein’s philosophical thinking was driven by and contributed to the solution of problems first encountered in his work in physics. Equally significant are Einstein’s relations with and influence on other prominent twentieth-century philosophers of science, including Moritz Schlick, Hans Reichenbach, Ernst Cassirer, Philipp Frank, Henri Bergson, Émile Meyerson.",
    "UCLA Housing Room Sign Up (RSU) is an online process that provides eligible returning undergraduate residents the opportunity to select their housing for the next academic year. All eligible students interested in housing for the 2024-2025 academic year must submit their application and participate in RSU in order to receive a housing offer. ",
]

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

# lsi = models.LsiModel(corpus, id2word=dictionary, num_topics = 2)

lsi_model = LdaModel(corpus=corpus, num_topics = 3, id2word = dictionary)
topics = lsi_model.print_topics()
print(topics)

docs_per_topic = [[] for _ in topics]

for doc_id, doc_bow in enumerate(corpus):
        doc_topics = lsi_model.get_document_topics(doc_bow)

        for topic_id, score in doc_topics:
            docs_per_topic[topic_id].append((doc_id, score))

print(docs_per_topic)

# for topic in topics:
#     print(topic)
# doc = "Human computer interaction"
# vec_bow = dictionary.doc2bow(doc.lower().split())
# print(vec_bow)
# vec_lsi = lsi[vec_bow]  # convert the query to LSI space
#
# index = similarities.MatrixSimilarity(lsi[corpus])  # transform corpus to LSI space and index it
# print(index)
#
#
# sims = index[vec_lsi]  # perform a similarity query against the corpus
# print(list(enumerate(sims)))  # print (document_number, document_similarity) 2-tuples
#
# sims = sorted(enumerate(sims), key=lambda item: -item[1])
# for doc_position, doc_score in sims:
#     print(doc_score, documents[doc_position])
