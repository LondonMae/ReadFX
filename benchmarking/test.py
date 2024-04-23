# import these modules
from nltk.corpus import wordnet
from nltk.corpus import stopwords
from nltk.corpus import words
import nltk
import string

text = "Much the same point could be made, and was made by Duhem himself, against those who would insulate certain statements against empirical refutation by claiming for them the status of conventional definitions. Edouard Le Royhad argued thus about the law of free fall. It could not be refuted by experiment because it functioned as a definition of free fall. And Henri Poincarsaid much the same about the principles of mechanics more generally. As Einstein answered the neo-Kantians, so Duhem answered this species of conventionalist: Yes, experiment cannot refute, say, the law of free fall by itself, but only because it is part of a larger theoretical whole that has empirical content only as a whole, and various other elements of that whole could as well be said to be, alone, immune to refutation. That Einstein should deploy against the neo-Kantians in the early 1920s the argument that Duhem used against the conventionalism of Poincar and Le Roy is interesting from the point of view of Einsteins relationships with those who were leading the development of logical empiricism and scientific philosophy in the 1920s, especially Schlick and Reichenbach. Einstein shared with Schlick and Reichenbach the goal of crafting a new form of empiricism that would be adequate to the task of defending general relativity against neo-Kantian critiques. But while they all agreed that what Kant regarded as the a priori element in scientific cognition was better understood as a conventional moment in science, they were growing to disagree dramatically over the nature and place of conventions in science. The classic logical empiricist view that the moment of convention was restricted to conventional coordinating definitions that endow individual primitive terms, worked well, but did not comport well with the holism about theories. It was this argument over the nature and place of conventions in science that underlies Einsteins gradual philosophical estrangement from Schlick and Reichenbach in the 1920s. Serious in its own right, the argument over conventions was entangled with two other issues as well, namely, realism and Einsteins famous view of theories as the free creations of the human spirit. In both instances what troubled Einstein was that a verificationist semantics made the link between theory and experience too strong, leaving too small a role for theory, itself, and the creative theorizing that produces it. If theory choice is empirically determinate, especially if theoretical concepts are explicitly constructed from empirical primitives, as in Carnaps program in the Aufbau, then it is hard to see how theory gives us a story about anything other than experience. As noted, Einstein was not what we would today call a scientific realist, but he still believed that there was content in theory beyond mere empirical content. He believed that theoretical science gave us a window on nature itself, even if, in principle, there will be no one uniquely correct story at the level of deep ontology. And if the only choice in theory choice is one among conventional coordinating definitions, then that is no choice at all, a point stressed by Reichenbach, especially, as an important positive implication of his position. Reichenbach argued that if empirical content is the only content, then empirically equivalent theories have the same content, the difference resulting from their different choices of coordinating definitions being like in kind to the difference between es regnet and il pleut, or the difference between expressing the result of a measurement in English or metric units, just two different ways of saying the same thing. But then, Einstein would ask, where is there any role for the creative intelligence of the theoretical physicist if there is no room for genuine choice in science, if experience somehow dictates theory construction? The argument over the nature and role of conventions in science continued to the very end of Einsteins life, reaching its highest level of sophistication in the exchange between Reichenbach and Einstein the Library of Living Philosophers volume, Albert Einstein: Philosopher-Physicist. The question is, again, whether the choice of a geometry is empirical, conventional, or a priori. In his contribution, Reichenbach reasserted his old view that once an appropriate coordinating definition is established, equating some practically rigid rod with the geometers rigid body, then the geometry of physical space is wholly determined by empirical evidence."

# lemmatizer = WordNetLemmatizer()

tokens = nltk.tokenize.word_tokenize(text)

stop_words = set(stopwords.words("english"))
words = set(words.words())


filtered_sentence = [w for w in tokens if (not w.lower() in stop_words) and (not w.lower() in string.punctuation) and ( not w.lower() in words) and (len(wordnet.synsets(w)) < 1)]

print("gives" in words)

print(filtered_sentence)
# print(words)
print(len(filtered_sentence))
count = 0
for word in filtered_sentence:
    if len(wordnet.synsets(word)) < 1:
        count += 1
        print(word)
print(count)
