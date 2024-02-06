from rake_nltk import Rake

# Uses stopwords for english from NLTK, and all puntuation characters by
# default
r = Rake()

text = "I have no way of understanding what I mean, and no means of pressuring myself to understand it. I am a lost wanderer on the banks of heaven's gates, and days come and go and I cannot figure out a reason for my own existence, for my very life. I've been asking myself: Why do I even bother? Why do I wake up in the morning? Why the hell do I put up with the traffic for a shitty cup of coffee? Why not end it all? I've lived a damn good life, why do I feel the need to milk it? All the milk has gone sour, so slowly though all too slowly. A young boy with vibrant dreams and world views of bright neons and infinite skies sucks upon the sweetest of tits. He sucks and sucks and sucks and regrets nothing – he doesn't know regret. The thing cannot even remember yesterday, yet the nectar is sweeter than any there is: milk is not wine. Perhaps my life would have fulfillment or joy or something other then this endless restlessness for death's knock. I would just need this milk instead of this rotten wine stuff. This “better with age” shit. I need milk, fresh and nutritious and full of dreams and life. A young boy grows and grows, sure, as do all things, but little by little all their milk sours, slowly, so damn slowly. Its a creeping slow, the way seasons creep their way into each other forming the infinite cycle. It is the creeping of sour molecules entering the nectar of life: one, two, three... and then the boy blinks... thirty thousand, thirty thousand and one and on and on until you no longer have milk to drink. What then when it is gone? Wine. A boy realizes nothing. He spills it and spits it and does just about anything, but drink it. A boy won't stop that nonsense – I assure you – until those sour molecules finally produce flavor, and when it does a boy will come to grips with the souring of his milk, as did I, and I fear it was in this moment that not only I, but all believe they sip upon spoiled milk. We no longer can drink such a wretched beverage! We must adapt to our buds! Hoist up a glass of the finest wine and pronounce the joys of age and the richness of life in the presence of wine. Goddammit, what fools we are, to think wine better than milk; what forgetful fools. Does no one remember the sweetest tastes of the nectar? The honey of tit, the gold of growth, the foundation of all this wine business: milk, abandoned when most needed. There is no such thing as “better with age” wine is wine, but milk isn't milk, I swear. With age it sours and solidifies and does more harm then good, but oh, what a wonder it is. I would give all the wine I own for a spoonful of milk just half sour. I remember sipping upon the crushed grapes, curious. I remember the wonders I had towards it: Will this satisfy my crave for life? Will it nourish? Will it make me young again? And I discovered it came close, sure, very damn close, so much so it took the taste of milk away all at once, but not permanently, never permanently because such an intoxicant lasts for a few hours or so with its purple haze of wishful worries and beautiful tomorrows, but when reality nestles back next to you. There is no haze and there are no beautiful tomorrows; there is only an appointment or some duty, so many goddamn duties. A person, of course, can reenter the haze and enjoy the wine and buy themselves into “better with age”. It is then that milk truly curls. They will die with, so much milk, so much goddamn milk. Why leave any to spare? Why leave it to rot and decay and sit basking in solidified dreams and days of glory wine chases behind. It is no high, it is no haze. Listen to me now if you haven't to anything before; I have been where you are: I have sucked the tit, I have spilled and let spoil, I have abandoned for “better with age” slogans, and I have come back to it still for there is no sweeter nectar then that of milk and even when the molecules of sour start to be noticed, and the expatriation date is almost up; never, and I mean never, leave any to spare."

r.extract_keywords_from_text(text)

b=r.get_ranked_phrases_with_scores()


for phrase in b:
    if phrase[0] > 4.0:
        print(phrase[1])
