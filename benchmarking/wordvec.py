# Python program to generate word vectors using Word2Vec

# importing all necessary modules
from gensim.models import Word2Vec
from gensim.test.utils import lee_corpus_list
import gensim
from nltk.tokenize import sent_tokenize, word_tokenize
import warnings

warnings.filterwarnings(action='ignore')


data = []

i = "When alice was in the wonderland, she saw many cool things like a talking rabbit and a a cupcake that made her grow and shrink "
i = i.replace("\n", " ")
temp = []

stoplist = set('for a of the and to in'.split())
texts = [word for word in i.lower().split() if word not in stoplist]

print(texts)

model = Word2Vec(lee_corpus_list, vector_size=24, epochs=100)
word_vectors = model.wv

# # Create CBOW model
# model1 = gensim.models.Word2Vec(data, min_count=1,
# 								vector_size=100, window=5)

# # Print results
# print("Cosine similarity between 'alice' " +
# 	"and 'wonderland' - CBOW : ",
# 	model1.wv.similarity('alice', 'wonderland'))
# print(model1)

# # Create Skip Gram model
# model2 = gensim.models.Word2Vec(data, min_count=1, vector_size=100,
# 								window=5, sg=1)

# # Print results
# print("Cosine similarity between 'alice' " +
# 	"and 'wonderland' - Skip Gram : ",
# 	model2.wv.similarity('alice', 'wonderland'))

# print("Cosine similarity between 'alice' " +
# 	"and 'machines' - Skip Gram : ",
# 	model2.wv.similarity('alice', 'machines'))
