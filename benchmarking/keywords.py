from rake_nltk import Rake
import nltk

# Uses stopwords for english from NLTK, and all puntuation characters by
# default
r = Rake()

text = "ALexei Fyodorovich Karamazov was the third son of Fyodor Pavlovich Karamazov, a landowner in our district who became a celebrity (and is remembered to this day) because of the tragic and mysterious end he met exactly thirteen years ago, which will be described in its proper place. For the moment, I will only say of this \"landowner\" (as they referred to him here, although he spent hardly any time on his land) that he belonged to a peculiar though widespread human type, the sort of man who is not only wretched and depraved but also muddle-headed--muddle-headed in a way that allows him to pull off all sorts of shady little financial deals and not much else.Fyodor Karamazov, for instance, started with next to nothing; he was just about the lowliest landowner among us, a man who would dash off to dine at other people's tables whenever he was given a chance and who sponged off people as much as he could. Yet, at his death, they found that he had a hundred thousand rubles in hard cash. And with all that, throughout his life he remained one of the most muddle-headed eccentrics in our entire district. Let me repeat: it was not stupidity, for most such eccentrics are really quite intelligent and cunning, and their lack of common sense is of a special kind, a national variety.He had been married twice and had three sons--the eldest, Dmitry, by his first wife, and the other two, Ivan and Alexei, by the second. Fyodor Karamazov's first wife came from a fairly wealthy family of landed gentry--the Miusovs--also from our district. Why should a girl with a dowry, a beautiful girl moreover, one of those bright, clever young things who in this generation are no longer rare and who even cropped up occasionally in the last--why should she marry such a worthless \"freak,\" as they called him? I will not really attempt to explain. But, then, I once knew a young lady of the old, \"romantic\" generation who, after several years of secret love for a gentleman whom, please note, she could have peacefully married at any moment she chose, invented insurmountable obstacles for herself and, one stormy night, jumped from a steep, rather cliff-like bank into a fairly deep, rapid river and drowned, all because she fancied herself an Ophelia out of Shakespeare. Indeed, if the bank, on which she had had her eye for a long time, had been less picturesque or had there simply been a flat bank, it is conceivable that the suicide would never have taken place at all. This is a true story, and it must be assumed that in the past two or three generations quite a few similar incidents have occurred. In the same way, what Adelaida Miusov did was undoubtedly an echo of outside influences and also the act of exasperation of a captive mind. Perhaps she was trying to display feminine independence, to rebel against social conventions, against the despotism of her family and relatives, while her ready imagination convinced her, if only for a moment, that Fyodor Karamazov, despite his reputation as a sponger, was nevertheless one of the boldest and most caustic men of that \"period of transition toward better things,\" whereas in reality he was nothing but a nasty buffoon. The fact that the marriage plans included elopement added piquancy to it, making it more exciting for Adelaida. Fyodor, at that time, would, of course, have done anything to improve his lowly position, and the opportunity to latch on to a good family and to pocket a dowry was extremely tempting to him. As for love, there does not seem to have been any, either on the bride's part or, despite her beauty, on Karamazov's. This was perhaps a unique case in Fyodor Karamazov's life, for he was as sensual as a man can be, one who throughout his life was always prepared, at the slightest encouragement, to chase any skirt. But his wife just happened to be the one woman who did not appeal to him sensually in the least.Right after the elopement, Adelaida realized that she felt nothing but scorn for her husband. It quickly became obvious what married life was to be. Despite the fact that her family accepted the situation quite soon and gave the runaway bride her dowry, relations between husband and wife became an everlasting succession of quarrels."


text = "The Bronze Age, from c. 3300 BC, witnessed the intensification of agriculture in civilizations such as Mesopotamian Sumer, ancient Egypt, ancient Sudan, the Indus Valley civilisation of the Indian subcontinent, ancient China, and ancient Greece. From 100 BC to 1600 AD, world population continued to grow along with land use, as evidenced by the rapid increase in methane emissions from cattle and the cultivation of rice."

words = nltk.tokenize.wordpunct_tokenize(text)
print(len(words))
r.extract_keywords_from_text(text)

b=r.get_ranked_phrases_with_scores()
print(len(b))

n=0
for i in range(len(b)):
    if b[i][0] > 0:
        print(b[i])
