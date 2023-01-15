import axios from 'axios';
import { doc, getDoc } from 'firebase/firestore';
import { DecodedIdToken } from 'firebase-admin/lib/auth/token-verifier';
import { NextApiRequest, NextApiResponse } from 'next';
import {
  Configuration,
  CreateCompletionResponseUsage,
  OpenAIApi,
} from 'openai';

import { applyMiddleware, getRateLimitMiddlewares } from '@/lib/applyRateLimit';
import { admin } from '@/lib/firebaseAdmin';
import { db } from '@/lib/firebaseClient';

import { plans } from '@/constant/plans';
import getMultipleRandom from '@/utils/getMultipleRandom';

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const middlewares = getRateLimitMiddlewares({ limit: 30 }).map(applyMiddleware);
const plots = [
  {
    prompt: '',
    completion:
      " Unlucky assassin Ladybug is determined to do his job peacefully after one too many gigs has gone off the rails. Fate has other plans, however: Ladybug's latest mission puts him on a collision course with lethal adversaries from around the globe--all with connected, yet conflicting, objectives--on the world's fastest train. The end of the line is just the beginning in this non-stop thrill-ride through modern-day Japan.\n\n###\n\n",
  },
  {
    prompt: '',
    completion:
      " The Godfather 'Don' Vito Corleone is the head of the Corleone mafia family in New York. He is at the event of his daughter's wedding. Michael, Vito's youngest son and a decorated WW II Marine is also present at the wedding. Michael seems to be uninterested in being a part of the family business. Vito is a powerful man, and is kind to all those who give him respect but is ruthless against those who do not. But when a powerful and treacherous rival wants to sell drugs and needs the Don's influence for the same, Vito refuses to do it. What follows is a clash between Vito's fading old values and the new ways which may cause Michael to do the thing he was most reluctant in doing and wage a mob war against all the other mafia families which could tear the Corleone family apart.\n\n###\n\n",
  },
  {
    prompt: '',
    completion:
      ' Michael, the young and idealistic son of Vito Corleone, the head of the most powerful Mafia clan in New York, returns home as a war hero and is determined to live his own life. But tragic circumstances make him face the legacy of his family.\n\n###\n\n',
  },
  {
    prompt: '',
    completion:
      ' The life of Vito Corleone is shown as he becomes from a boy born in Sicily to one of the most respected mafia dons of New York while Micheal attempts to expand his business empire into Las Vegas, Florida and pre-revolution Cuba while facing his own personal problems trying to keep his collapsing marriage and relationship with his brother intact.\n\n###\n\n',
  },
  {
    prompt: '',
    completion:
      " In need of a unanimous, cut-and-dried guilty verdict by the end of the session, twelve jurors crammed in a small New York City jury room during one scorching hot day have the fate of an impecunious eighteen-year-old man in their hands. However, in what seems like an open-and-shut case of first-degree murder, one man, Juror #8, harbours reasonable doubt about the young defendant's guilt, having a hunch that there is a lot more to it than meets the eye. After all, a man is innocent until proven guilty.\n\n###\n\n",
  },
  {
    prompt: '',
    completion:
      ' Jules Winnfield and Vincent Vega are two hit men who are out to retrieve a suitcase stolen from their employer, mob boss Marsellus Wallace. Wallace has also asked Vincent to take his wife Mia out a few days later when Wallace himself will be out of town. Butch Coolidge is an aging boxer who is paid by Wallace to lose his fight. The lives of these seemingly unrelated people are woven together comprising of a series of funny, bizarre and uncalled-for incidents.\n\n###\n\n',
  },
  {
    prompt: '',
    completion:
      ' Slow-witted Forrest Gump has never thought of himself as disadvantaged, and thanks to his supportive mother, he leads anything but a restricted life. Whether dominating on the gridiron as a college football star, fighting in Vietnam or captaining a shrimp boat, Forrest inspires people with his childlike optimism. But one person Forrest cares about most may be the most difficult to save -- his childhood love, the sweet but troubled Jenny.\n\n###\n\n',
  },
  {
    prompt: '',
    completion:
      ' Sick of his dead-end corporate career and disgusted with the empty consumer culture, a young man and his devious friend create a new club where young men come to relieve their frustrations by beating each other to a pulp\n\n###\n\n',
  },
  {
    prompt: '',
    completion:
      " Dom Cobb is a skilled thief, the absolute best in the dangerous art of extraction, stealing valuable secrets from deep within the subconscious during the dream state, when the mind is at its most vulnerable. Cobb's rare ability has made him a coveted player in this treacherous new world of corporate espionage, but it has also made him an international fugitive and cost him everything he has ever loved. Now Cobb is being offered a chance at redemption. One last job could give him his life back but only if he can accomplish the impossible, inception. Instead of the perfect heist, Cobb and his team of specialists have to pull off the reverse: their task is not to steal an idea, but to plant one. If they succeed, it could be the perfect crime. But no amount of careful planning or expertise can prepare the team for the dangerous enemy that seems to predict their every move. An enemy that only Cobb could have seen coming.\n\n###\n\n",
  },
  {
    prompt: '',
    completion:
      ' In a future world where the wealthy can purchase immortality, a low-level employee at a corporation that sells immortality finds himself tasked with disposing of the bodies of those who have reached the end of their natural life span. As he does his job, he begins to question the morality of a system that allows some to live forever while others die, and he starts to plot a rebellion.\n\n###\n\n',
  },
  {
    prompt: '',
    completion:
      ' Thomas A. Anderson is a man living two lives. By day he is an average computer programmer and by night a hacker known as Neo. Neo has always questioned his reality, but the truth is far beyond his imagination. Neo finds himself targeted by the police when he is contacted by Morpheus, a legendary computer hacker branded a terrorist by the government. As a rebel against the machines, Neo must confront the agents: super-powerful computer programs devoted to stopping Neo and the entire human rebellion.\n\n###\n\n',
  },
  {
    prompt: '',
    completion:
      " George Bailey never got a chance to fulfill his life's ambitions of exploring the world and building skyscrapers. As he watches his friends and family become success stories, he dreads on running his father's building and loan business, rivaling the grumpy old Mr. Potter. When a financial discrepancy puts him in a difficult position, his guardian angel, Clarence Odbody, comes to show him what life would have been like if he had never been born.\n\n###\n\n",
  },
  {
    prompt: '',
    completion:
      " Earth's future has been riddled by disasters, famines, and droughts. There is only one way to ensure mankind's survival: Interstellar travel. A newly discovered wormhole in the far reaches of our solar system allows a team of astronauts to go where no man has gone before, a planet that may have the right environment to sustain human life.\n\n###\n\n",
  },
  {
    prompt: '',
    completion:
      ' Marty McFly, a 17-year-old high school student, is accidentally sent 30 years into the past in a time-traveling DeLorean invented by his close friend, the maverick scientist Doc Brown.\n\n###\n\n',
  },
  {
    prompt: '',
    completion:
      ' A young lion prince is cast out of his pride by his cruel uncle, who claims he killed his father. While the uncle rules with an iron paw, the prince grows up beyond the Savannah, living by a philosophy: No worries for the rest of your days. But when his past comes to haunt him, the young prince must decide his fate: Will he remain an outcast or face his demons and become what he needs to be?\n\n###\n\n',
  },
  {
    prompt: '',
    completion:
      ' In the end of the nineteenth century, in London, Robert Angier, his beloved wife Julia McCullough, and Alfred Borden are friends and assistants of a magician. When Julia accidentally dies during a performance, Robert blames Alfred for her death, and they become enemies. Both become famous and rival magicians, sabotaging the performance of the other on the stage. When Alfred performs a successful trick, Robert becomes obsessed trying to disclose the secret of his competitor with tragic consequences.\n\n###\n\n',
  },
  {
    prompt: '',
    completion:
      " WALL-E, short for Waste Allocation Load Lifter Earth-class, is the last robot left on Earth. He spends his days tidying up the planet, one piece of garbage at a time. But during 700 years, WALL-E has developed a personality, and he's more than a little lonely. Then he spots EVE, a sleek and shapely probe sent back to Earth on a scanning mission. Smitten WALL-E embarks on his greatest adventure yet when he follows EVE across the galaxy.\n\n###\n\n",
  },
  {
    prompt: '',
    completion:
      ' Lily hasn’t always had it easy, but that’s never stopped her from working hard for the life she wants. She’s come a long way from the small town where she grew up—she graduated from college, moved to Boston, and started her own business. And when she feels a spark with a gorgeous neurosurgeon named Ryle Kincaid, everything in Lily’s life seems too good to be true.\n\nRyle is assertive, stubborn, maybe even a little arrogant. He’s also sensitive, brilliant, and has a total soft spot for Lily. And the way he looks in scrubs certainly doesn’t hurt. Lily can’t get him out of her head. But Ryle’s complete aversion to relationships is disturbing. Even as Lily finds herself becoming the exception to his “no dating” rule, she can’t help but wonder what made him that way in the first place.\n\nAs questions about her new relationship overwhelm her, so do thoughts of Atlas Corrigan—her first love and a link to the past she left behind. He was her kindred spirit, her protector. When Atlas suddenly reappears, everything Lily has built with Ryle is threatened.\n\n###\n\n',
  },
  {
    prompt: '',
    completion:
      ' Colby Mills once felt destined for a musical career, until tragedy grounded his aspirations. Now the head of a small family farm in North Carolina, he spontaneously takes a gig playing at a bar in St. Pete Beach, Florida, seeking a rare break from his duties at home.\n\nBut when he meets Morgan Lee, his world is turned upside-down, making him wonder if the responsibilities he has shouldered need dictate his life forever. The daughter of affluent Chicago doctors, Morgan has graduated from a prestigious college music program with the ambition to move to Nashville and become a star. Romantically and musically, she and Colby complete each other in a way that neither has ever known.\n\nWhile they are falling headlong in love, Beverly is on a heart-pounding journey of another kind. Fleeing an abusive husband with her six-year-old son, she is trying to piece together a life for them in a small town far off the beaten track. With money running out and danger seemingly around every corner, she makes a desperate decision that will rewrite everything she knows to be true.\n\nIn the course of a single unforgettable week, two young people will navigate the exhilarating heights and heartbreak of first love. Hundreds of miles away, Beverly will put her love for her young son to the test. And fate will draw all three people together in a web of life-altering connections . . . forcing each to wonder whether the dream of a better life can ever survive the weight of the past.\n\n###\n\n',
  },
  {
    prompt: '',
    completion:
      " Lowen Ashleigh is a struggling writer on the brink of financial ruin when she accepts the job offer of a lifetime. Jeremy Crawford, husband of bestselling author Verity Crawford, has hired Lowen to complete the remaining books in a successful series his injured wife is unable to finish.\n\nLowen arrives at the Crawford home, ready to sort through years of Verity's notes and outlines, hoping to find enough material to get her started. What Lowen doesn't expect to uncover in the chaotic office is an unfinished autobiography Verity never intended for anyone to read. Page after page of bone-chilling admissions, including Verity's recollection of the night their family was forever altered.\n\nLowen decides to keep the manuscript hidden from Jeremy, knowing its contents would devastate the already grieving father. But as Lowen's feelings for Jeremy begin to intensify, she recognizes all the ways she could benefit if he were to read his wife's words. After all, no matter how devoted Jeremy is to his injured wife, a truth this horrifying would make it impossible for him to continue to love her.\n\n###\n\n",
  },
  {
    prompt: '',
    completion:
      ' Aging and reclusive Hollywood movie icon Evelyn Hugo is finally ready to tell the truth about her glamorous and scandalous life. But when she chooses unknown magazine reporter Monique Grant for the job, no one is more astounded than Monique herself. Why her? Why now?\n\nMonique is not exactly on top of the world. Her husband has left her, and her professional life is going nowhere. Regardless of why Evelyn has selected her to write her biography, Monique is determined to use this opportunity to jumpstart her career.\n\nSummoned to Evelyn’s luxurious apartment, Monique listens in fascination as the actress tells her story. From making her way to Los Angeles in the 1950s to her decision to leave show business in the ‘80s, and, of course, the seven husbands along the way, Evelyn unspools a tale of ruthless ambition, unexpected friendship, and a great forbidden love. Monique begins to feel a very real connection to the legendary star, but as Evelyn’s story near its conclusion, it becomes clear that her life intersects with Monique’s own in tragic and irreversible ways.\n\n###\n\n',
  },
  {
    prompt: '',
    completion:
      ' Sarah Morgan is a successful and powerful defense attorney in Washington D.C. As a named partner at her firm, life is going exactly how she planned. The same cannot be said for her husband, Adam. He’s a struggling writer who has had little success in his career and he tires of his and Sarah’s relationship as she is constantly working.\n\nOut in the secluded woods, at the couple’s lake house, Adam engages in a passionate affair with Kelly Summers. But one morning everything changes. Kelly is found brutally stabbed to death and now, Sarah must take on her hardest case yet, defending her own husband, a man accused of murdering his mistress.\n\n###\n\n',
  },
  {
    prompt: '',
    completion:
      " Mickey Haller is a Lincoln Lawyer, a criminal defense attorney who operates out of the backseat of his Lincoln Town Car, traveling between the far-flung courthouses of Los Angeles to defend clients of every kind. Bikers, con artists, drunk drivers, drug dealers -- they're all on Mickey Haller's client list.\n\nFor him, the law is rarely about guilt or innocence, it's about negotiation and manipulation. Sometimes it's even about justice.\n\nA Beverly Hills playboy arrested for attacking a woman he picked up in a bar chooses Haller to defend him, and Mickey has his first high-paying client in years. It is a defense attorney's dream, what they call a franchise case. And as the evidence stacks up, Haller comes to believe this may be the easiest case of his career.\n\nThen someone close to him is murdered and Haller discovers that his search for innocence has brought him face-to-face with evil as pure as a flame. To escape without being burned, he must deploy every tactic, feint, and instinct in his arsenal -- this time to save his own life.\n\n###\n\n",
  },
  {
    prompt: '',
    completion:
      ' Chemist Elizabeth Zott is not your average woman. In fact, Elizabeth Zott would be the first to point out that there is no such thing as an average woman. But it’s the early 1960s and her all-male team at Hastings Research Institute takes a very unscientific view of equality. Except for one: Calvin Evans; the lonely, brilliant, Nobel–prize nominated grudge-holder who falls in love with—of all things—her mind. True chemistry results.\n\nBut like science, life is unpredictable. Which is why a few years later Elizabeth Zott finds herself not only a single mother, but the reluctant star of America’s most beloved cooking show Supper at Six. Elizabeth’s unusual approach to cooking (“combine one tablespoon acetic acid with a pinch of sodium chloride”) proves revolutionary. But as her following grows, not everyone is happy. Because as it turns out, Elizabeth Zott isn’t just teaching women to cook. She’s daring them to change the status quo.\n\n###\n\n',
  },
  {
    prompt: '',
    completion:
      ' US President Keegan Barrett has swept into office on his success as Director of the CIA. Six months into his first term, he devises a clandestine power grab with deadly consequences.\n\nBarrett personally orders CIA agents Liam Grey and Noa Himel to execute his plan, but their loyalties are divided. The CIA serves at the pleasure of the president, yet they’ve sworn to support and defend the Constitution of the United States against all enemies, foreign and domestic.\n\nWhen the threat comes directly from the Oval Office, that’s where the blowback begins.\n\n###\n\n',
  },
  {
    prompt: '',
    completion:
      " A father and his son walk alone through burned America. Nothing moves in the ravaged landscape save the ash on the wind. It is cold enough to crack stones, and when the snow falls it is gray. The sky is dark. Their destination is the coast, although they don't know what, if anything, awaits them there. They have nothing; just a pistol to defend themselves against the lawless bands that stalk the road, the clothes they are wearing, a cart of scavenged food—and each other.\n\n###\n\n",
  },
  {
    prompt: '',
    completion:
      " Guy Montag is a fireman. His job is to destroy the most illegal of commodities, the printed book, along with the houses in which they are hidden. Montag never questions the destruction and ruin his actions produce, returning each day to his bland life and wife, Mildred, who spends all day with her television 'family.' But when he meets an eccentric young neighbor, Clarisse, who introduces him to a past where people didn’t live in fear and to a present where one sees the world through the ideas in books instead of the mindless chatter of television, Montag begins to question everything he has ever known.\n\n###\n\n",
  },
  {
    prompt: '',
    completion:
      " On a warm summer morning in North Carthage, Missouri, it is Nick and Amy Dunne’s fifth wedding anniversary. Presents are being wrapped and reservations are being made when Nick’s clever and beautiful wife disappears. Husband-of-the-Year Nick isn’t doing himself any favors with cringe-worthy daydreams about the slope and shape of his wife’s head, but passages from Amy's diary reveal the alpha-girl perfectionist could have put anyone dangerously on edge. Under mounting pressure from the police and the media—as well as Amy’s fiercely doting parents—the town golden boy parades an endless series of lies, deceits, and inappropriate behavior. Nick is oddly evasive, and he’s definitely bitter—but is he really a killer?\n\n###\n\n",
  },
  {
    prompt: '',
    completion:
      ' A farm is taken over by its overworked, mistreated animals. With flaming idealism and stirring slogans, they set out to create a paradise of progress, justice, and equality.\n\n###\n\n',
  },
  {
    prompt: '',
    completion:
      ' Winston Smith toes the Party line, rewriting history to satisfy the demands of the Ministry of Truth. With each lie he writes, Winston grows to hate the Party that seeks power for its own sake and persecutes those who dare to commit thoughtcrimes. But as he starts to think for himself, Winston can’t escape the fact that Big Brother is always watching...\n\n###\n\n',
  },
  {
    prompt: '',
    completion:
      ' Looking at real estate isn’t usually a life-or-death situation, but an apartment open house becomes just that when a failed bank robber bursts in and takes a group of strangers hostage. The captives include a recently retired couple who relentlessly hunt down fixer-uppers to avoid the painful truth that they can’t fix their own marriage. There’s a wealthy bank director who has been too busy to care about anyone else and a young couple who are about to have their first child but can’t seem to agree on anything. Add to the mix an eighty-seven-year-old woman who has lived long enough not to be afraid of someone waving a gun in her face, a flustered but still-ready-to-make-a-deal real estate agent, and a mystery man who has locked himself in the apartment’s only bathroom, and you’ve got the worst group of hostages in the world.\n\nEach of them carries a lifetime of grievances, hurts, secrets, and passions that are ready to boil over. None of them is entirely who they appear to be. And all of them - the bank robber included - desperately crave some sort of rescue. As the authorities and the media surround the premises, these reluctant allies will reveal surprising truths about themselves and set in motion a chain of events so unexpected that even they can hardly explain what happens next.\n\n###\n\n',
  },
  {
    prompt: '',
    completion:
      ' Olive Torres is used to being the unlucky twin: from inexplicable mishaps to a recent layoff, her life seems to be almost comically jinxed. By contrast, her sister Ami is an eternal champion...she even managed to finance her entire wedding by winning a slew of contests. Unfortunately for Olive, the only thing worse than constant bad luck is having to spend the wedding day with the best man (and her nemesis), Ethan Thomas.\n\nOlive braces herself for wedding hell, determined to put on a brave face, but when the entire wedding party gets food poisoning, the only people who aren’t affected are Olive and Ethan. Suddenly there’s a free honeymoon up for grabs, and Olive will be damned if Ethan gets to enjoy paradise solo.\n\nAgreeing to a temporary truce, the pair head for Maui. After all, ten days of bliss is worth having to assume the role of loving newlyweds, right? But the weird thing is...Olive doesn’t mind playing pretend. In fact, the more she pretends to be the luckiest woman alive, the more it feels like she might be.\n\n###\n\n',
  },
  {
    prompt: '',
    completion:
      " Meet Ove. He’s a curmudgeon - the kind of man who points at people he dislikes as if they were burglars caught outside his bedroom window. He has staunch principles, strict routines, and a short fuse. People call him 'the bitter neighbor from hell'. But must Ove be bitter just because he doesn’t walk around with a smile plastered to his face all the time?\n\nBehind the cranky exterior there is a story and a sadness. So when one November morning a chatty young couple with two chatty young daughters move in next door and accidentally flatten Ove’s mailbox, it is the lead-in to a comical and heartwarming tale of unkempt cats, unexpected friendship, and the ancient art of backing up a U-Haul. All of which will change one cranky old man and a local residents’ association to their very foundations.\n\n###\n\n",
  },
  {
    prompt: '',
    completion:
      ' People say Beartown is finished. A tiny community nestled deep in the forest, it is slowly losing ground to the ever encroaching trees. But down by the lake stands an old ice rink, built generations ago by the working men who founded this town. And in that ice rink is the reason people in Beartown believe tomorrow will be better than today. Their junior ice hockey team is about to compete in the national semifinals, and they actually have a shot at winning. All the hopes and dreams of this place now rest on the shoulders of a handful of teenage boys.\n\nBeing responsible for the hopes of an entire town is a heavy burden, and the semifinal match is the catalyst for a violent act that will leave a young girl traumatized and a town in turmoil. Accusations are made, and, like ripples on a pond, they travel through all of Beartown, leaving no resident unaffected.\n\n###\n\n',
  },
  {
    prompt: '',
    completion:
      " Hildy Good is a townie. A lifelong resident of a small community on the rocky coast of Boston's North Shore, she knows pretty much everything about everyone. And she's good at lots of things, too. A successful real-estate broker, mother, and grandmother, her days are full. But her nights have become lonely ever since her daughters, convinced their mother was drinking too much, sent her off to rehab. Now she's in recovery―more or less.\n\nAlone and feeling unjustly persecuted, Hildy finds a friend in Rebecca McAllister, one of the town's wealthy newcomers. Rebecca is grateful for the friendship and Hildy feels like a person of the world again, as she and Rebecca escape their worries with some harmless gossip and a bottle of wine by the fire―just one of their secrets.\n\nBut Rebecca is herself the subject of town gossip. When Frank Getchell, an old friend who shares a complicated history with Hildy, tries to warn her away from Rebecca, Hildy attempts to protect her friend from a potential scandal. Soon, however, Hildy is busy trying to protect her own reputation. When a cluster of secrets becomes dangerously entwined, the reckless behavior of one person threatens to expose the other, and this darkly comic novel takes a chilling turn.\n\n###\n\n",
  },
  {
    prompt: '',
    completion:
      ' When nineteen-year-old huntress Feyre kills a wolf in the woods, a terrifying creature arrives to demand retribution. Dragged to a treacherous magical land she knows about only from legends, Feyre discovers that her captor is not truly a beast, but one of the lethal, immortal faeries who once ruled her world.\n\nAt least, he’s not a beast all the time.\n\nAs she adapts to her new home, her feelings for the faerie, Tamlin, transform from icy hostility into a fiery passion that burns through every lie she’s been told about the beautiful, dangerous world of the Fae. But something is not right in the faerie lands. An ancient, wicked shadow is growing, and Feyre must find a way to stop it, or doom Tamlin―and his world―forever.\n\n###\n\n',
  },
  {
    prompt: '',
    completion:
      " For years, rumors of the 'Marsh Girl' have haunted Barkley Cove, a quiet town on the North Carolina coast. So in late 1969, when handsome Chase Andrews is found dead, the locals immediately suspect Kya Clark, the so-called Marsh Girl. But Kya is not what they say. Sensitive and intelligent, she has survived for years alone in the marsh that she calls home, finding friends in the gulls and lessons in the sand. Then the time comes when she yearns to be touched and loved. When two young men from town become intrigued by her wild beauty, Kya opens herself to a new life—until the unthinkable happens.\n\n###\n\n",
  },
  {
    prompt: '',
    completion:
      ' Every day I clean the Winchesters’ beautiful house top to bottom. I collect their daughter from school. And I cook a delicious meal for the whole family before heading up to eat alone in my tiny room on the top floor.\n\nI try to ignore how Nina makes a mess just to watch me clean it up. How she tells strange lies about her own daughter. And how her husband Andrew seems more broken every day. But as I look into Andrew’s handsome brown eyes, so full of pain, it’s hard not to imagine what it would be like to live Nina’s life. The walk-in closet, the fancy car, the perfect husband.\n\nI only try on one of Nina’s pristine white dresses once. Just to see what it’s like. But she soon finds out… and by the time I realize my attic bedroom door only locks from the outside, it’s far too late.\n\nBut I reassure myself: the Winchesters don’t know who I really am.\n\n###\n\n',
  },
  {
    prompt: '',
    completion:
      " Nine years ago, Vivienne Jones nursed her broken heart like any young witch would: vodka, weepy music, bubble baths…and a curse on the horrible boyfriend. Sure, Vivi knows she shouldn’t use her magic this way, but with only an 'orchard hayride' scented candle on hand, she isn’t worried it will cause him anything more than a bad hair day or two.\n\nThat is until Rhys Penhallow, descendent of the town’s ancestors, breaker of hearts, and annoyingly just as gorgeous as he always was, returns to Graves Glen, Georgia. What should be a quick trip to recharge the town’s ley lines and make an appearance at the annual fall festival turns disastrously wrong. With one calamity after another striking Rhys, Vivi realizes her silly little Ex Hex may not have been so harmless after all.\n\nSuddenly, Graves Glen is under attack from murderous wind-up toys, a pissed off ghost, and a talking cat with some interesting things to say. Vivi and Rhys have to ignore their off the charts chemistry to work together to save the town and find a way to break the break-up curse before it’s too late.\n\n###\n\n",
  },
  {
    prompt: '',
    completion:
      ' It is 1985 in a small Irish town. During the weeks leading up to Christmas, Bill Furlong, a coal merchant and family man faces into his busiest season. Early one morning, while delivering an order to the local convent, Bill makes a discovery which forces him to confront both his past and the complicit silences of a town controlled by the church.\n\n###\n\n',
  },
  {
    prompt: '',
    completion:
      ' Despite losing her parents in a tragic accident just before her fourteenth Christmas, Susan Norcross has had it better than most, with loving grandparents to raise her and a gang of quirky, devoted friends to support her. Now a successful bookstore owner in a tight-knit Michigan lakeside community, Susan is facing down forty—the same age as her mother when she died—and she can’t help but see everything she hasn’t achieved, including finding a love match of her own. To add to the pressure, everyone in her small town believes it’s Susan’s destiny to meet and marry a man dressed as Santa, just like her mother and grandmother before her. So it seems cosmically unfair that the man she makes an instant connection with at an annual Santa Run is lost in the crowd before she can get his name.\n\n###\n\n',
  },
  {
    prompt: '',
    completion:
      ' The time is our own, when rustlers have given way to drug-runners and small towns have become free-fire zones. One day, a good old boy named Llewellyn Moss finds a pickup truck surrounded by a bodyguard of dead men. A load of heroin and two million dollars in cash are still in the back. When Moss takes the money, he sets off a chain reaction of catastrophic violence that not even the law—in the person of aging, disillusioned Sheriff Bell—can contain.\n\n###\n\n',
  },
  {
    prompt: '',
    completion:
      ' Lucy Albright is far from her Long Island upbringing when she arrives on the campus of her small California college and happy to be hundreds of miles from her mother—whom she’s never forgiven for an act of betrayal in her early teen years. Quickly grasping at her fresh start, Lucy embraces college life and all it has to offer. And then she meets Stephen DeMarco. Charming. Attractive. Complicated. Devastating.\n\nConfident and cocksure, Stephen sees something in Lucy that no one else has, and she’s quickly seduced by this vision of herself, and the sense of possibility that his attention brings her. Meanwhile, Stephen is determined to forget an incident buried in his past that, if exposed, could ruin him, and his single-minded drive for success extends to winning, and keeping, Lucy’s heart.\n\nLucy knows there’s something about Stephen that isn’t to be trusted. Stephen knows Lucy can’t tear herself away. And their addicting entanglement will have consequences they never could have imagined.\n\n###\n\n',
  },
  {
    prompt: '',
    completion:
      ' They say you can never go home again, and for Persephone Fraser, ever since she made the biggest mistake of her life a decade ago, that has felt too true. Instead of glittering summers on the lakeshore of her childhood, she spends them in a stylish apartment in the city, going out with friends, and keeping everyone a safe distance from her heart.\n\nUntil she receives the call that sends her racing back to Barry’s Bay and into the orbit of Sam Florek—the man she never thought she’d have to live without.\n\nFor six summers, through hazy afternoons on the water and warm summer nights working in his family’s restaurant and curling up together with books—medical textbooks for him and work-in-progress horror short stories for her—Percy and Sam had been inseparable. Eventually that friendship turned into something breathtakingly more, before it fell spectacularly apart.\n\n\n\nWhen Percy returns to the lake for Sam’s mother’s funeral, their connection is as undeniable as it had always been. But until Percy can confront the decisions she made and the years she’s spent punishing herself for them, they’ll never know whether their love might be bigger than the biggest mistakes of their past.\n\n###\n\n',
  },
  {
    prompt: '',
    completion:
      " In June, 1954, eighteen-year-old Emmett Watson is driven home to Nebraska by the warden of the juvenile work farm where he has just served fifteen months for involuntary manslaughter. His mother long gone, his father recently deceased, and the family farm foreclosed upon by the bank, Emmett's intention is to pick up his eight-year-old brother, Billy, and head to California where they can start their lives anew. But when the warden drives away, Emmett discovers that two friends from the work farm have hidden themselves in the trunk of the warden's car. Together, they have hatched an altogether different plan for Emmett's future, one that will take them all on a fateful journey in the opposite direction—to the City of New York.\n\n###\n\n",
  },
  {
    prompt: '',
    completion:
      " When the world is still counting the cost of the Second World War and the Iron Curtain has closed, eleven-year-old Roland Baines's life is turned upside down. Two thousand miles from his mother's protective love, stranded at an unusual boarding school, his vulnerability attracts piano teacher Miss Miriam Cornell, leaving scars as well as a memory of love that will never fade.\n\nNow, when his wife vanishes, leaving him alone with his tiny son, Roland is forced to confront the reality of his restless existence. As the radiation from Chernobyl spreads across Europe, he begins a search for answers that looks deep into his family history and will last for the rest of his life.\n\nHaunted by lost opportunities, Roland seeks solace through every possible means—music, literature, friends, sex, politics, and, finally, love cut tragically short, then love ultimately redeemed.\n\n###\n\n",
  },
  {
    prompt: '',
    completion:
      " Adrift in a raft after a deadly ship explosion, ten people struggle for survival at sea. Three days pass. Short on water, food and hope, they spot a man floating in the waves. They pull him in.\n\n'Thank the Lord we found you,' a passenger says.\n\n'I am the Lord,' the man whispers.\n\n###\n\n",
  },
  {
    prompt: '',
    completion:
      ' In the rain forests of Peru, an ancient manuscript has been discovered. Within its pages are 9 key insights into life itself -- insights each human being is predicted to grasp sequentially; one insight, then another, as we move toward a completely spiritual culture on Earth.\n\nDrawing on ancient wisdom, it tells you how to make connections among the events happening in your life right now and lets you see what is going to happen to you in the years to come. The story it tells is a gripping one of adventure and discovery, but it is also a guidebook that has the power to crystallize your perceptions of why you are where you are in life and to direct your steps with a new energy and optimism as you head into tomorrow.\n\n###\n\n',
  },
  {
    prompt: '',
    completion:
      " Downsized, broke, and dumped, 38-year-old Marley sneaks home to her childhood bedroom in the town she couldn't wait to escape 20 years ago. Not much has changed in Culpepper. The cool kids are still cool. Now they just own car dealerships and live in McMansions next door. Oh, and the whole town is still talking about that Homecoming she ruined her senior year.\n\nDesperate for a new start, Marley accepts a temporary teaching position. Can the girl banned from all future Culpepper High Homecomings keep the losing-est girls soccer team in school history from killing each other and prevent carpal tunnel in a bunch of phone-clutching gym class students?\n\nMaybe with the help of Jake Weston, high school bad boy turned sexy good guy. When the school rumor mill sends Marley to the principal's office to sign an ethics contract, the tattooed track coach, dog dad, and teacher of the year becomes her new fake boyfriend and alibi - for a price. The Deal: He'll teach her how to coach if she teaches him how to be in a relationship.\n\n###\n\n",
  },
  {
    prompt: '',
    completion:
      ' Kiara and her brother, Marcus, are scraping by in an East Oakland apartment complex optimistically called the Regal-Hi. Both have dropped out of high school, their family fractured by death and prison\n\nBut while Marcus clings to his dream of rap stardom, Kiara hunts for work to pay their rent—which has more than doubled—and to keep the nine-year-old boy next door, abandoned by his mother, safe and fed. One night, what begins as a drunken misunderstanding with a stranger turns into the job Kiara never imagined wanting but now desperately needs: nightcrawling. Her world breaks open even further when her name surfaces in an investigation that exposes her as a key witness in a massive scandal within the Oakland Police Department.\n\n###\n\n',
  },
  {
    prompt: '',
    completion:
      ' In 1922, Count Alexander Rostov is deemed an unrepentant aristocrat by a Bolshevik tribunal, and is sentenced to house arrest in the Metropol, a grand hotel across the street from the Kremlin. Rostov, an indomitable man of erudition and wit, has never worked a day in his life, and must now live in an attic room while some of the most tumultuous decades in Russian history are unfolding outside the hotel’s doors. Unexpectedly, his reduced circumstances provide him entry into a much larger world of emotional discovery.\n\n###\n\n',
  },
  {
    prompt: '',
    completion:
      ' Morgan Grant and her sixteen-year-old daughter, Clara, would like nothing more than to be nothing alike.\n\nMorgan is determined to prevent her daughter from making the same mistakes she did. By getting pregnant and married way too young, Morgan put her own dreams on hold. Clara doesn’t want to follow in her mother’s footsteps. Her predictable mother doesn’t have a spontaneous bone in her body.\n\nWith warring personalities and conflicting goals, Morgan and Clara find it increasingly difficult to coexist. The only person who can bring peace to the household is Chris―Morgan’s husband, Clara’s father, and the family anchor. But that peace is shattered when Chris is involved in a tragic and questionable accident. The heartbreaking and long-lasting consequences will reach far beyond just Morgan and Clara.\n\nWhile struggling to rebuild everything that crashed around them, Morgan finds comfort in the last person she expects to, and Clara turns to the one boy she’s been forbidden to see. With each passing day, new secrets, resentment, and misunderstandings make mother and daughter fall further apart. So far apart, it might be impossible for them to ever fall back together.\n\n###\n\n',
  },
  {
    prompt: '',
    completion:
      ' In 1937 in the snowbound city of Kiev (now known as Kyiv), wry and bookish history student Mila Pavlichenko organizes her life around her library job and her young son—but Hitler’s invasion of Ukraine and Russia sends her on a different path. Given a rifle and sent to join the fight, Mila must forge herself from studious girl to deadly sniper—a lethal hunter of Nazis known as Lady Death. When news of her three hundredth kill makes her a national heroine, Mila finds herself torn from the bloody battlefields of the eastern front and sent to America on a goodwill tour.\n\nStill reeling from war wounds and devastated by loss, Mila finds herself isolated and lonely in the glittering world of Washington, DC—until an unexpected friendship with First Lady Eleanor Roosevelt and an even more unexpected connection with a silent fellow sniper offer the possibility of happiness. But when an old enemy from Mila’s past joins forces with a deadly new foe lurking in the shadows, Lady Death finds herself battling her own demons and enemy bullets in the deadliest duel of her life.\n\n###\n\n',
  },
  {
    prompt: '',
    completion:
      ' Born a generation apart and with very different ideas about love and family, Mariam and Laila are two women brought jarringly together by war, by loss and by fate. As they endure the ever escalating dangers around them-in their home as well as in the streets of Kabul-they come to form a bond that makes them both sisters and mother-daughter to each other, and that will ultimately alter the course not just of their own lives but of the next generation.\n\n###\n\n',
  },
  {
    prompt: '',
    completion:
      ' In her twenties, Belle da Costa Greene is hired by J. P. Morgan to curate a collection of rare manuscripts, books, and artwork for his newly built Pierpont Morgan Library. Belle becomes a fixture in New York City society and one of the most powerful people in the art and book world, known for her impeccable taste and shrewd negotiating for critical works as she helps create a world-class collection.\n\nBut Belle has a secret, one she must protect at all costs. She was born not Belle da Costa Greene but Belle Marion Greener. She is the daughter of Richard Greener, the first Black graduate of Harvard and a well-known advocate for equality. Belle’s complexion isn’t dark because of her alleged Portuguese heritage that lets her pass as white—her complexion is dark because she is African American.\n\n###\n\n',
  },
  {
    prompt: '',
    completion:
      ' It’s the year 2044, and the real world is an ugly place.\n\nLike most of humanity, Wade Watts escapes his grim surroundings by spending his waking hours jacked into the OASIS, a sprawling virtual utopia that lets you be anything you want to be, a place where you can live and play and fall in love on any of 10,000 planets.\n\nAnd like most of humanity, Wade dreams of being the one to discover the ultimate lottery ticket that lies concealed within this virtual world. For somewhere inside this giant networked playground, OASIS creator James Halliday has hidden a series of fiendish puzzles that will yield massive fortune - and remarkable power - to whoever can unlock them.\n\nFor years, millions have struggled fruitlessly to attain this prize, knowing only that Halliday’s riddles are based in the pop culture he loved - that of the late 20th century. And for years, millions have found in this quest another means of escape, retreating into happy, obsessive study of Halliday’s icons. Like many of his contemporaries, Wade is as comfortable debating the finer points of John Hughes’s oeuvre, playing Pac-Man, or reciting Devo lyrics as he is scrounging power to run his OASIS rig.\n\nAnd then Wade stumbles upon the first puzzle.\n\nSuddenly the whole world is watching, and thousands of competitors join the hunt - among them certain powerful players who are willing to commit very real murder to beat Wade to this prize. Now the only way for Wade to survive and preserve everything he knows is to win. But to do so, he may have to leave behind his oh-so-perfect virtual existence and face up to life - and love - in the real world he’s always been so desperate to escape.\n\n###\n\n',
  },
  {
    prompt: '',
    completion:
      ' When Thomas wakes up in the lift, the only thing he can remember is his name. He’s surrounded by strangers—boys whose memories are also gone.\n\nOutside the towering stone walls that surround them is a limitless, ever-changing maze. It’s the only way out—and no one’s ever made it through alive.\n\nThen a girl arrives. The first girl ever. And the message she delivers is terrifying: Remember. Survive. Run.\n\n###\n\n',
  },
  {
    prompt: '',
    completion:
      " In order to develop a secure defense against a hostile alien race's next attack, government agencies breed child geniuses and train them as soldiers. A brilliant young boy, Andrew 'Ender' Wiggin lives with his kind but distant parents, his sadistic brother Peter, and the person he loves more than anyone else, his sister Valentine. Peter and Valentine were candidates for the soldier-training program but didn't make the cut - young Ender is the Wiggin drafted to the orbiting Battle School for rigorous military training.\n\nEnder's skills make him a leader in school and respected in the Battle Room, where children play at mock battles in zero gravity. Yet growing up in an artificial community of young soldiers Ender suffers greatly from isolation, rivalry from his peers, pressure from the adult teachers, and an unsettling fear of the alien invaders. His psychological battles include loneliness, fear that he is becoming like the cruel brother he remembers, and fanning the flames of devotion to his beloved sister. Is Ender the general Earth needs?\n\nBut Ender is not the only result of the genetic experiments. The war with the Buggers has been raging for a hundred years, and the quest for the perfect general has been underway for almost as long. Ender's two older siblings are every bit as unusual as he is, but in very different ways. Between the three of them lie the abilities to remake a world. If, that is, the world survives.\n\n###\n\n",
  },
  {
    prompt: '',
    completion:
      ' On a bitter-cold day, in the December of his junior year at Harvard, Sam Masur exits a subway car and sees, amid the hordes of people waiting on the platform, Sadie Green. He calls her name. For a moment, she pretends she hasn’t heard him, but then, she turns, and a game begins: a legendary collaboration that will launch them to stardom. These friends, intimates since childhood, borrow money, beg favors, and, before even graduating college, they have created their first blockbuster, Ichigo. Overnight, the world is theirs. Not even twenty-five years old, Sam and Sadie are brilliant, successful, and rich, but these qualities won’t protect them from their own creative ambitions or the betrayals of their hearts.\n\n###\n\n',
  },
  {
    prompt: '',
    completion:
      ' An average man is kidnapped and imprisoned in a shabby cell for 15 years without explanation. He then is released, equipped with money, a cellphone and expensive clothes. As he strives to explain his imprisonment and get his revenge, Oh Dae-Su soon finds out that his kidnapper has a greater plan for him and is set onto a path of pain and suffering in an attempt to uncover the motive of his mysterious tormentor.\n\n###\n\n',
  },
  {
    prompt: '',
    completion:
      ' Eddy persuades his three pals to pool money for a vital poker game against a powerful local mobster, Hatchet Harry. Eddy loses, after which Harry gives him a week to pay back 500,000 pounds.\n\n###\n\n',
  },
  {
    prompt: '',
    completion:
      " Young Miguel simply loves music. But his family has a mysterious ban on anyone from their clan performing music. The ban dates back for many generations yet Miguel dreams of becoming an accomplished musician just like his idol, Ernesto de la Cruz. Longing to prove his musical talents, Miguel finds himself in the technicolor Land of the Dead. Along his way, he meets the charming trickster Hector, and together, they set out to find the real story behind his family's mysterious ban on music.\n\n###\n\n",
  },
  {
    prompt: '',
    completion:
      ' As a boy, Carl Fredricksen wanted to explore South America and find the forbidden Paradise Falls. About 64 years later he gets to begin his journey along with Boy Scout Russell by lifting his house with thousands of balloons. On their journey, they make many new friends including a talking dog, and figure out that someone has evil plans. Carl soon realizes that this evildoer is his childhood idol.\n\n###\n\n',
  },
  {
    prompt: '',
    completion:
      " Woody, a good-hearted cowboy doll who belongs to a young boy named Andy, sees his position as Andy's favorite toy jeopardized when his mom buys him a Buzz Lightyear action figure. Even worse, the arrogant Buzz thinks he's a real spaceman on a mission to return to his home planet. When Andy's family moves to a new house, Woody and Buzz must escape the clutches of maladjusted neighbor Sid Phillips and reunite with their boy.\n\n###\n\n",
  },
  {
    prompt: '',
    completion:
      " When a large black monolith is found beneath the surface of the moon, the reaction immediately is that it was intentionally buried. When the point of origin is confirmed as Jupiter, an expedition is sent in hopes of finding the source. When Dr. David Bowman discovers faults in the expeditionary spacecraft's communications system, he discovers more than he ever wanted to know.\n\n###\n\n",
  },
  {
    prompt: '',
    completion:
      ' Truman Burbankis happy with his life. He is a successful business man, he has a nice wife and many friends. However, Truman finds his life is getting very repetitive. Actually every moment of his life is being filmed, being watched by millions, and that his world is limited in a small Hollywood film set. Truman decides to follow his discovery no matter how hard and how much it pains him.\n\n###\n\n',
  },
  {
    prompt: '',
    completion:
      ' Barely 21 yet, Frank is a skilled forger who has passed as a doctor, lawyer and pilot. FBI agent Carl becomes obsessed with tracking down the con man, who only revels in the pursuit.\n\n###\n\n',
  },
  {
    prompt: '',
    completion:
      " While in Paris on business, Harvard symbologist Robert Langdon receives an urgent late-night phone call: the elderly curator of the Louvre has been murdered inside the museum. Near the body, police have found a baffling cipher. While working to solve the enigmatic riddle, Langdon is stunned to discover it leads to a trail of clues hidden in the works of Da Vinci, clues visible for all to see, yet ingeniously disguised by the painter.\n\nLangdon joins forces with a gifted French cryptologist, Sophie Neveu, and learns the late curator was involved in the Priory of Sion - an actual secret society whose members included Sir Isaac Newton, Botticelli, Victor Hugo, and Da Vinci, among others.\n\nIn a breathless race through Paris, London, and beyond, Langdon and Neveu match wits with a faceless powerbroker who seems to anticipate their every move. Unless Langdon and Neveu can decipher the labyrinthine puzzle in time, the Priory's ancient secret - and an explosive historical truth - will be lost forever.\n\n###\n\n",
  },
  {
    prompt: '',
    completion:
      " Isabella Swan's move to Forks, a small, perpetually rainy town in Washington, could have been the most boring move she ever made. But once she meets the mysterious and alluring Edward Cullen, Isabella's life takes a thrilling and terrifying turn.\n\nUp until now, Edward has managed to keep his vampire identity a secret in the small community he lives in, but now nobody is safe, especially Isabella, the person Edward holds most dear. The lovers find themselves balanced precariously on the point of a knife -- between desire and danger.\n\n###\n\n",
  },
  {
    prompt: '',
    completion:
      ' After a staged terrorist attack kills the President and most of Congress, the government is deposed and taken over by the oppressive and all-controlling Republic of Gilead. Offred, now a Handmaid serving in the household of the enigmatic Commander and his bitter wife, can remember a time when she lived with her husband and daughter and had a job, before she lost even her own name. Despite the danger, Offred learns to navigate the intimate secrets of those who control her every move, risking her life in breaking the rules in hopes of ending this oppression. \n\n###\n\n',
  },
  {
    prompt: '',
    completion:
      " Orphaned into the household of her Aunt Reed at Gateshead and subject to the cruel regime at Lowood charity school, Jane Eyre nonetheless emerges unbroken in spirit and integrity. She takes up the post of governess at Thornfield Hall, falls in love with Mr. Rochester, and discovers the impediment to their lawful marriage in a story that transcends melodrama to portray a woman's passionate search for a richer life than that traditionally allowed women in Victorian society.\n\n###\n\n",
  },
  {
    prompt: '',
    completion:
      " In 1929 New York, bond-seller Nick Carraway, in a sanitarium for depression and alcoholism, is persuaded by his doctor to write a therapeutic account of what put him there. Nick's journal describes how, seven years earlier, he had moved to a tiny house on Long Island adjoining the sumptuous mansion owned by enigmatic neighbour, the fabulously wealthy Jay Gatsby. After attending one of Gatsby's legendary parties Nick is asked by Gatsby to arrange a meeting with his cousin Daisy, now married to the brutish. philandering Tom Buchanan, who was Gatsby's true love prior to war service. As Nick complies he comes to see that Gatsby, once a poor boy, has recreated himself as a fascinating millionaire purely to win Daisy back but the events of a drunken afternoon conspire to bring about an ending which is anything but happy.\n\n###\n\n",
  },
  {
    prompt: '',
    completion:
      " Clare and Henry have known each other since Clare was six and Henry was 36. They were married when Clare was 23 and Henry was 31. Impossible but true, because Henry is one of the first people diagnosed with Chrono-Displacement Disorder: periodically his genetic clock resets and he finds himself misplaced in time, pulled to moments of emotional gravity from his life, past and future. His disappearances are spontaneous, his experiences unpredictable, alternately harrowing and amusing.\n\nClare and Henry's story unfolds from both points of view, depicting the effects of time travel on their marriage and their passionate love for each other. They attempt to live normal lives, pursuing familiar goals: steady jobs, good friends, children of their own. All of this is threatened by something they can neither prevent nor control, making their story intensely moving and entirely unforgettable.\n\n###\n\n",
  },
  {
    prompt: '',
    completion:
      " Dr. Sam Anderson is one of the most celebrated scientists in history. Ten years ago, he invented a device that changed the world forever. Now his life is about to be ripped apart—and his own creation may be to blame.\n\nOne fateful morning, Sam discovers that his girlfriend has been murdered and that his daughter is accused of the crime.\n\nSam believes she's innocent, but he can't prove it. There's only one thing he can do to save his daughter: confess to the crime. And so he does.\n\nBut in the future, murderers aren't sent to prison. They're sent to the past.\n\nThanks to Sam's invention–Absolom–the world's worst criminals are exiled forever, sent back to the time of the dinosaurs, where they live out their lives alone.\n\nAs Sam steps into the Absolom chamber to leave for the Late Triassic, he makes a promise: he will get back to his family, clear his name, and find the person who killed the woman he loved.\n\nWhat Sam doesn't know is that there's a secret waiting for him in the past. And it might be his only hope of saving himself and his family.\n\nSam isn't the only one seeking justice. In the present, his daughter, Adeline, also embarks on a mission to find the person who framed her and tore her family apart. She's already lost her mother. She can't bear losing her father too.\n\nAs Adeline peels back the layers of the conspiracy against her family, she uncovers more questions than answers. Everyone around her is hiding a secret, including her legal guardian. And some people aren't what they seem.\n\nAdeline soon finds herself in the midst of a mystery that stretches across the past, present, and future—and leads to a revelation that will change everything.\n\n###\n\n",
  },
  {
    prompt: '',
    completion:
      ' Somewhere out beyond the edge of the universe there is a library that contains an infinite number of books, each one the story of another reality. One tells the story of your life as it is, along with another book for the other life you could have lived if you had made a different choice at any point in your life. While we all wonder how our lives might have been, what if you had the chance to go to the library and see for yourself? Would any of these other lives truly be better?\n\n###\n\n',
  },
  {
    prompt: '',
    completion:
      " It was a dark and stormy night; Meg Murry, her small brother Charles Wallace, and her mother had come down to the kitchen for a midnight snack when they were upset by the arrival of a most disturbing stranger.\n\n'Wild nights are my glory,' the unearthly stranger told them. 'I just got caught in a downdraft and blown off course. Let me sit down for a moment, and then I'll be on my way. Speaking of ways, by the way, there is such a thing as a tesseract.'\n\nA tesseract is a wrinkle in time.\n\n###\n\n",
  },
  {
    prompt: '',
    completion:
      " Winning means fame and fortune. Losing means certain death. The Hunger Games have begun. . . . In the ruins of a place once known as North America lies the nation of Panem, a shining Capitol surrounded by twelve outlying districts. The Capitol is harsh and cruel and keeps the districts in line by forcing them all to send one boy and one girl between the ages of twelve and eighteen to participate in the annual Hunger Games, a fight to the death on live TV. Sixteen-year-old Katniss Everdeen regards it as a death sentence when she steps forward to take her sister's place in the Games. But Katniss has been close to dead before-and survival, for her, is second nature. Without really meaning to, she becomes a contender. But if she is to win, she will have to start making choices that weigh survival against humanity and life against love.\n\n###\n\n",
  },
  {
    prompt: '',
    completion:
      " Harry Potter has never even heard of Hogwarts when the letters start dropping on the doormat at number four, Privet Drive. Addressed in green ink on yellowish parchment with a purple seal, they are swiftly confiscated by his grisly aunt and uncle. Then, on Harry's eleventh birthday, a great beetle-eyed giant of a man called Rubeus Hagrid bursts in with some astonishing news: Harry Potter is a wizard, and he has a place at Hogwarts School of Witchcraft and Wizardry\n\n###\n\n",
  },
  {
    prompt: '',
    completion:
      ' Life in the community where Jonas lives is idyllic. Designated birthmothers produce newchildren, who are assigned to appropriate family units. Citizens are assigned their partners and their jobs. No one thinks to ask questions. Everyone obeys. Everyone is the same. Except Jonas.\n\nNot until he is given his life assignment as the Receiver of Memory does he begin to understand the dark, complex secrets behind his fragile community. Gradually Jonas learns that power lies in feelings. But when his own power is put to the test—when he must try to save someone he loves—he may not be ready. Is it too soon? Or too late?\n\n###\n\n',
  },
  {
    prompt: '',
    completion:
      " No one ever said life was easy. But Ponyboy is pretty sure that he's got things figured out. He knows that he can count on his brothers, Darry and Sodapop. And he knows that he can count on his friends—true friends who would do anything for him, like Johnny and Two-Bit. But not on much else besides trouble with the Socs, a vicious gang of rich kids whose idea of a good time is beating up on “greasers” like Ponyboy. At least he knows what to expect—until the night someone takes things too far.\n\n###\n\n",
  },
  {
    prompt: '',
    completion:
      ' In the tourist town of Wharton, on the coast of Lake Superior, Tess Bell is renovating her old family home into a bed-and-breakfast during the icy dead of winter…\n\nAs the house’s restoration commences, a shuttered art studio is revealed. Inside are paintings Tess’s late grandfather, beloved and celebrated artist Sebastian Bell, hid away for generations. But these appear to be the works of a twisted mind, almost unrecognizable as paintings she and others familiar with his art would expect. The sinister canvases raise disturbing questions for Tess, sparking nightmares and igniting in her an obsession to unearth the truth around their origins.\n\n###\n\n',
  },
  {
    prompt: '',
    completion:
      " Twelve-year-old Bird Gardner lives a quiet existence with his loving but broken father, a former linguist who now shelves books in a university library. Bird knows to not ask too many questions, stand out too much, or stray too far. For a decade, their lives have been governed by laws written to preserve 'American culture' in the wake of years of economic instability and violence. To keep the peace and restore prosperity, the authorities are now allowed to relocate children of dissidents, especially those of Asian origin, and libraries have been forced to remove books seen as unpatriotic—including the work of Bird’s mother, Margaret, a Chinese American poet who left the family when he was nine years old.\n\nBird has grown up disavowing his mother and her poems; he doesn’t know her work or what happened to her, and he knows he shouldn’t wonder. But when he receives a mysterious letter containing only a cryptic drawing, he is pulled into a quest to find her. His journey will take him back to the many folktales she poured into his head as a child, through the ranks of an underground network of librarians, into the lives of the children who have been taken, and finally to New York City, where a new act of defiance may be the beginning of much-needed change.\n\n###\n\n",
  },
  {
    prompt: '',
    completion:
      " Six days ago, astronaut Mark Watney became one of the first people to walk on Mars.\n\nNow, he's sure he'll be the first person to die there.\n\nAfter a dust storm nearly kills him and forces his crew to evacuate while thinking him dead, Mark finds himself stranded and completely alone with no way to even signal Earth that he’s alive - and even if he could get word out, his supplies would be gone long before a rescue could arrive.\n\nChances are, though, he won't have time to starve to death. The damaged machinery, unforgiving environment, or plain old 'human error' are much more likely to kill him first.\n\nBut Mark isn't ready to give up yet. Drawing on his ingenuity, his engineering skills - and a relentless, dogged refusal to quit - he steadfastly confronts one seemingly insurmountable obstacle after the next\n\n###\n\n",
  },
  {
    prompt: '',
    completion:
      " Ryland Grace is the sole survivor on a desperate, last-chance mission - and if he fails, humanity and the Earth itself will perish.\n\nExcept that right now, he doesn't know that. He can't even remember his own name, let alone the nature of his assignment or how to complete it.\n\nAll he knows is that he's been asleep for a very, very long time. And he's just been awakened to find himself millions of miles from home, with nothing but two corpses for company.\n\nHis crewmates dead, his memories fuzzily returning, he realizes that an impossible task now confronts him. Alone on this tiny ship that's been cobbled together by every government and space agency on the planet and hurled into the depths of space, it's up to him to conquer an extinction-level threat to our species.\n\nAnd thanks to an unexpected ally, he just might have a chance.\n\n###\n\n",
  },
  {
    prompt: '',
    completion:
      " Ani FaNelli seems to have it all: a glamorous job at a glossy magazine, an enviable figure with the wardrobe to match, and a handsome fiancé from a distinguished blue-blood family. But Ani FaNelli is an invention, that veneer of perfection carefully assembled in an attempt to distance herself from a shocking, sordid past.\n\nAs her wedding draws near, a documentary producer invites Ani to speak about the chilling incident that took place when she was a teenager at the prestigious Bradley School. Determined once and for all to silence the whispers of suspicion and blame, Ani must weigh her options carefully, when telling the whole truth could destroy the picture-perfect life she's worked so hard to create.\n\n###\n\n",
  },
  {
    prompt: '',
    completion:
      ' Attorney Jason Rich has made a fortune off other people’s bad luck. His billboard slogan—“In an accident? Get Rich!”—accosts motorists on highways from Alabama to Florida. As ambulance chasers go, he’s exceptional.\n\nBut after a recent divorce and a stint in rehab, Jason has hit a rough patch. And things only get worse when his sister, Jana, is accused of her husband’s murder. Even though Jason has no experience trying criminal cases, Jana begs him to represent her.\n\nJason has mixed feelings about returning to Lake Guntersville, Alabama—and even more reservations about diving back into his sister’s life. Between the drugs, the affairs, and a tendency to gaslight everyone in her inner circle, Jana has plenty of enemies in town.\n\nBut did Jana hire someone to kill her husband? Jason isn’t so sure. He heads back to his hometown to unravel the truth and face off against opponents old and new.\n\n###\n\n',
  },
  {
    prompt: '',
    completion:
      ' Before Owen Michaels disappears, he smuggles a note to his beloved wife of one year: Protect her. Despite her confusion and fear, Hannah Hall knows exactly to whom the note refers—Owen’s sixteen-year-old daughter, Bailey. Bailey, who lost her mother tragically as a child. Bailey, who wants absolutely nothing to do with her new stepmother.\n\nAs Hannah’s increasingly desperate calls to Owen go unanswered, as the FBI arrests Owen’s boss, as a US marshal and federal agents arrive at her Sausalito home unannounced, Hannah quickly realizes her husband isn’t who he said he was. And that Bailey just may hold the key to figuring out Owen’s true identity—and why he really disappeared.\n\nHannah and Bailey set out to discover the truth. But as they start putting together the pieces of Owen’s past, they soon realize they’re also building a new future—one neither of them could have anticipated.\n\n###\n\n',
  },
  {
    prompt: '',
    completion:
      ' Meet the picture-perfect Bird family: pragmatic Meg, dreamy Beth, and towheaded twins Rory and Rhys, one an adventurous troublemaker, the other his slighter, more sensitive counterpart. Their father is a sweet, gangly man, but it’s their beautiful, free-spirited mother Lorelei who spins at the center. In those early years, Lorelei tries to freeze time by filling their simple brick house with precious mementos. Easter egg foils are her favorite. Craft supplies, too. She hangs all of the children’s art, to her husband’s chagrin.\n\nThen one Easter weekend, a tragedy so devastating occurs that, almost imperceptibly, it begins to tear the family apart. Years pass and the children have become adults, while Lorelei has become the county’s worst hoarder. She has alienated her husband and children and has been living as a recluse. But then something happens that beckons the Bird family back to the house they grew up in - to finally understand the events of that long-ago Easter weekend and to unearth the many secrets hidden within the nooks and crannies of home.\n\n###\n\n',
  },
  {
    prompt: '',
    completion:
      ' Everyone from Wakarusa, Indiana, remembers the infamous case of January Jacobs, who was discovered in a ditch hours after her family awoke to find her gone. Margot Davies was six at the time, the same age as January—and they were next-door neighbors. In the twenty years since, Margot has grown up, moved away, and become a big-city journalist. But she’s always been haunted by the feeling that it could’ve been her. And the worst part is, January’s killer has never been brought to justice.\n\nWhen Margot returns home to help care for her uncle after he is diagnosed with early-onset dementia, she feels like she’s walked into a time capsule. Wakarusa is exactly how she remembers—genial, stifled, secretive. Then news breaks about five-year-old Natalie Clark from the next town over, who’s gone missing under circumstances eerily similar to January’s. With all the old feelings rushing back, Margot vows to find Natalie and to solve January’s murder once and for all.\n\nBut the police, Natalie’s family, the townspeople—they all seem to be hiding something. And the deeper Margot digs into Natalie’s disappearance, the more resistance she encounters, and the colder January’s case feels.\n\n###\n\n',
  },
  {
    prompt: '',
    completion:
      " At twenty-two years old, Sydney is enjoying a great life: She’s in college, working a steady job, in love with her wonderful boyfriend, Hunter, and rooming with her best friend, Tori. But everything changes when she discovers that Hunter is cheating on her—and she’s forced to decide what her next move should be.\n\nSoon, Sydney finds herself captivated by her mysterious and attractive neighbor, Ridge. She can't take her eyes off him or stop listening to the passionate way he plays his guitar every evening out on his balcony. And there’s something about Sydney that Ridge can’t ignore, either. They soon find themselves needing each other in more ways than one.\n\n###\n\n",
  },
  {
    prompt: '',
    completion:
      ' Newlywed Jade Westmore has finally found her forever in husband Wells, a charming, successful, and recently divorced architect—only there’s one caveat. Behind the gates of their elysian estate, hidden from street view in the caretaker’s cottage … lives Wells’ first wife, Sylvie.\n\nThree years ago, the original Mrs. Westmore suffered an unfortunate accident—and hasn’t uttered a sound since. Not a physician, psychologist, or world-renowned specialist has been able to elicit so much as a word from the silent woman … until now.\n\nOn an ordinary Tuesday while Wells was away—despite instructions to never disturb the fragile woman—Jade visited her isolated predecessor bearing a peace offering: a bouquet of white lilies. Only she wasn’t expecting Sylvie to have something for her as well: a slip of torn notebook paper with a single word scrawled in shaky black ink.\n\nThat word? Run.\n\n###\n\n',
  },
  {
    prompt: '',
    completion:
      " In a peaceful retirement village, four unlikely friends meet weekly in the Jigsaw Room to discuss unsolved crimes; together they call themselves the Thursday Murder Club.\n\nWhen a local developer is found dead with a mysterious photograph left next to the body, the Thursday Murder Club suddenly find themselves in the middle of their first live case.\n\nAs the bodies begin to pile up, can our unorthodox but brilliant gang catch the killer, before it's too late?\n\n###\n\n",
  },
  {
    prompt: '',
    completion:
      ' Mallory Quinn is fresh out of rehab when she takes a job as a babysitter for Ted and Caroline Maxwell. She is to look after their five-year-old son, Teddy.\n\nMallory immediately loves it. She has her own living space, goes out for nightly runs, and has the stability she craves. And she sincerely bonds with Teddy, a sweet, shy boy who is never without his sketchbook and pencil. His drawings are the usual fare: trees, rabbits, balloons. But one day, he draws something different: a man in a forest, dragging a woman’s lifeless body.\n\nThen, Teddy’s artwork becomes increasingly sinister, and his stick figures quickly evolve into lifelike sketches well beyond the ability of any five-year-old. Mallory begins to wonder if these are glimpses of a long-unsolved murder, perhaps relayed by a supernatural force.\n\nKnowing just how crazy it all sounds, Mallory nevertheless sets out to decipher the images and save Teddy before it’s too late.\n\n###\n\n',
  },
  {
    prompt: '',
    completion:
      ' After Tova Sullivan’s husband died, she began working the night shift at the Sowell Bay Aquarium, mopping floors and tidying up. Keeping busy has always helped her cope, which she’s been doing since her eighteen-year-old son, Erik, mysteriously vanished on a boat in Puget Sound over thirty years ago.\n\nTova becomes acquainted with curmudgeonly Marcellus, a giant Pacific octopus living at the aquarium. Marcellus knows more than anyone can imagine but wouldn’t dream of lifting one of his eight arms for his human captors—until he forms a remarkable friendship with Tova.\n\nEver the detective, Marcellus deduces what happened the night Tova’s son disappeared. And now Marcellus must use every trick his old invertebrate body can muster to unearth the truth for her before it’s too late.\n\n###\n\n',
  },
  {
    prompt: '',
    completion:
      " They are an unlikely pair: George is 'small and quick and dark of face'; Lennie, a man of tremendous size, has the mind of a young child. Yet they have formed a 'family,' clinging together in the face of loneliness and alienation.\n\nLaborers in California's dusty vegetable fields, they hustle work when they can, living a hand-to-mouth existence. For George and Lennie have a plan: to own an acre of land and a shack they can call their own. When they land jobs on a ranch in the Salinas Valley, the fulfillment of their dream seems to be within their grasp. But even George cannot guard Lennie from the provocations of a flirtatious woman, nor predict the consequences of Lennie's unswerving obedience to the things George taught him.\n\n###\n\n",
  },
  {
    prompt: '',
    completion:
      ' Stanley Yelnats is under a curse. A curse that began with his no-good-dirty-rotten-pig-stealing-great-great-grandfather and has since followed generations of Yelnatses. Now Stanley has been unjustly sent to a boys’ detention center, Camp Green Lake, where the boys build character by spending all day, every day digging holes exactly five feet wide and five feet deep. There is no lake at Camp Green Lake. But there are an awful lot of holes.\n\nIt doesn’t take long for Stanley to realize there’s more than character improvement going on at Camp Green Lake. The boys are digging holes because the warden is looking for something.\n\n###\n\n',
  },
  {
    prompt: '',
    completion:
      ' Ridge and Sydney are thrilled to finally be together guilt-free. But as the two of them navigate this freedom, Warren and Bridgette’s relationship is as tumultuous as ever, and Maggie grapples with her illness.\n\nWhen she comes across an old list of things she wanted to do “maybe one of these days,” Maggie decides to live life to the fullest and accomplish these dreams. Maggie keeps Ridge updated on her adventures, but he can’t help but worry, even as Sydney grows more and more suspicious about their friendship. But if she’s going to move past this jealousy, she’ll need to reconcile how she and Ridge came together with the fact that Maggie will always be in their lives somehow…or end up walking away from the man she loves so much.\n\n###\n\n',
  },
  {
    prompt: '',
    completion:
      ' Fresh off a bad breakup with a longtime boyfriend, Nantucket sweetheart Lizbet Keaton is desperately seeking a second act. When she’s named the new general manager of the Hotel Nantucket, a once Gilded Age gem turned abandoned eyesore, she hopes that her local expertise and charismatic staff can win the favor of their new London billionaire owner, Xavier Darling, as well as that of Shelly Carpenter, the wildly popular Instagram tastemaker who can help put them back on the map. And while the Hotel Nantucket appears to be a blissful paradise, complete with a celebrity chef-run restaurant and an idyllic wellness center, there’s a lot of drama behind closed doors. The staff (and guests) have complicated pasts, and the hotel can’t seem to overcome the bad reputation it earned in 1922 when a tragic fire killed nineteen-year-old chambermaid Grace Hadley.\n\n###\n\n',
  },
  {
    prompt: '',
    completion:
      ' Celebrated children’s book author Agnes Lee is determined to secure her legacy—to complete what she knows will be the final volume of her pseudonymously written Franklin Square novels; and even more consuming, to permanently protect the peninsula of majestic coast in Maine known as Fellowship Point. To donate the land to a trust, Agnes must convince shareholders to dissolve a generations-old partnership. And one of those shareholders is her best friend, Polly.\n\nPolly Wister has led a different kind of life than Agnes: that of a well-off married woman with children, defined by her devotion to her husband, and philosophy professor with an inflated sense of stature. She exalts in creating beauty and harmony in her home, in her friendships, and in her family. Polly soon finds her loyalties torn between the wishes of her best friend and the wishes of her three sons—but what is it that Polly wants herself?\n\nAgnes’s designs are further muddied when an enterprising young book editor named Maud Silver sets out to convince Agnes to write her memoirs. Agnes’s resistance cannot prevent long-buried memories and secrets from coming to light with far-reaching repercussions for all.\n\n###\n\n',
  },
  {
    prompt: '',
    completion:
      ' Widower Mukesh lives a quiet life in Wembley, in West London after losing his beloved wife. He shops every Wednesday, goes to Temple, and worries about his granddaughter, Priya, who hides in her room reading while he spends his evenings watching nature documentaries.\n\nAleisha is a bright but anxious teenager working at the local library for the summer when she discovers a crumpled-up piece of paper in the back of To Kill a Mockingbird. It’s a list of novels that she’s never heard of before. Intrigued, and a little bored with her slow job at the checkout desk, she impulsively decides to read every book on the list, one after the other. As each story gives up its magic, the books transport Aleisha from the painful realities she’s facing at home.\n\nWhen Mukesh arrives at the library, desperate to forge a connection with his bookworm granddaughter, Aleisha passes along the reading list…hoping that it will be a lifeline for him too. Slowly, the shared books create a connection between two lonely souls, as fiction helps them escape their grief and everyday troubles and find joy again.\n\n###\n\n',
  },
];

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    try {
      await Promise.all(middlewares.map((middleware) => middleware(req, res)));
    } catch {
      return res.status(429).send('Too Many Requests. Please try again later');
    }

    try {
      const idToken = req.headers.authorization;
      const uid = req.body.uid;

      if (!idToken) {
        return res.status(401).send('Unauthorized 1');
      }
      let user: DecodedIdToken;
      try {
        user = await admin.auth().verifyIdToken(idToken as string);
      } catch (error) {
        return res.status(401).send('Unauthorized 2');
      }

      if (user.uid != uid) {
        return res.status(401).send('Unauthorized 3');
      }

      const docSnap = (await getDoc(doc(db, 'users', uid))).data();

      if (!docSnap) {
        throw new Error('User does not exist');
      }

      let isSubscribed: boolean;

      if (
        docSnap.subscription.planId == plans.tier1 ||
        docSnap.subscription.planId == plans.tier2 ||
        docSnap.subscription.planId == plans.tier3
      ) {
        isSubscribed = true;
      } else {
        isSubscribed = false;
      }

      if (!isSubscribed) {
        return res.status(401).send('Unauthorized 4');
      }

      const currentTokens = docSnap.subscription.tokens;
      const estimatedTokens = (200 / 3.8 + 10) * 2;

      if (currentTokens <= estimatedTokens) {
        return res.status(400).send('You have exceeded your monthly limit');
      }
      const response = await openai.createCompletion({
        model: 'text-davinci-003',
        prompt: generatePlot(),
        temperature: 0.85,
        max_tokens: 400,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
        user: 'testing',
      });

      const moderationRes = await axios.post(
        'https://api.openai.com/v1/moderations',
        {
          input: response.data.choices[0].text,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          },
        }
      );
      if (moderationRes.data.results.flagged === true) {
        return res
          .status(400)
          .send(
            'AI generated prohibited content. Please try again or try a different selection. Monthly word limit not affected.'
          );
      }
      const updatedTokens =
        currentTokens -
        (response.data.usage as CreateCompletionResponseUsage).total_tokens;
      await admin
        .firestore()
        .collection('users')
        .doc(uid)
        .update({ 'subscription.tokens': updatedTokens });
      res.json(response.data);
    } catch (error) {
      res.status(500).json({ msg: 'Unexpected error', error: error });
    }
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
  }
}

function generatePlot() {
  const randomPlots = getMultipleRandom(plots, 2);

  return `Suggest an original plot for a story:
  ${randomPlots[0].completion.trim()}
  Suggest an original plot for a story:
  ${randomPlots[1].completion.trim()}
  Suggest an original plot for a story:`;
}
