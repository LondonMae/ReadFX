from rake_nltk import Rake

r = Rake()

inp = input("type sentence")
while inp != "stop":
    inp = input()
    r.extract_keywords_from_text(inp)
    print(r.get_ranked_phrases_with_scores())
    