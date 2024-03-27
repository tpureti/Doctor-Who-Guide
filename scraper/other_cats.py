import requests
from bs4 import BeautifulSoup
from lxml import etree
import re
# from wiki_info import wiki_info
from functools import reduce
from itertools import zip_longest

ratings_info = dict()
ratings_info.setdefault("EpisodeNumber")
ratings_info.setdefault("EpisodeName")
ratings_info.setdefault("EpisodeDate")
ratings_info.setdefault("EpisodeRating")
ratings_info.setdefault("EpisodeVotes")
ratings_info.setdefault("EpisodeRuntime")

URL = "https://www.imdb.com/title/tt0056751/episodes/?season=11"
headers = {
    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/50.0.2661.102 Safari/537.36"}

story_episodes = [
    ("An Unearthly Child: ", "S1\.E([1-4])", "[1-4]"),
    ("The Daleks: ", "S1\.E([5-9]|1[0-1])", "[5-9]|1[0-1]"),
    ("The Edge of Destruction: ", "S1\.E(1[2-3])", "1[2-3]"),
    ("Marco Polo: ", "S1\.E(1[4-9]|2[0])", "1[4-9]|2[0]"),
    ("The Keys of Marinus: ", "S1\.E(2[1-6])", "2[1-6]"),
    ("The Aztecs: ", "S1\.E(2[7-9]|3[0])", "2[7-9]|3[0]"),
    ("The Sensorites: ", "S1\.E(3[1-6])", "3[1-6]"),
    ("The Reign of Terror: ", "S1\.E(3[7-9]|4[0-2])", "3[7-9]|4[0-2]"),
    ("Planet of Giants: ", "S2\.E[1-3](?!\S)", "4[3-5]"),
    ("The Dalek Invasion of Earth: ", "S2\.E[4-9](?!\S)", "4[6-9]|5[0-1]"),
    ("The Rescue: ", "S2\.E(1[0-1])", "5[2-3]"),
    ("The Romans: ", "S2\.E(1[2-5])", "5[4-7]"),
    ("The Web Planet: ", "S2\.E(1[6-9]|2[0-1])", "5[8-9]|6[0-3]"),
    ("The Crusade: ", "S2\.E(2[2-5])", "6[4-7]"),
    ("The Space Museum: ", "S2\.E(2[6-9])", "6[8-9]|7[0-1]"),
    ("The Chase: ", "S2\.E(3[0-5])", "7[2-7]"),
    ("The Time Meddler: ", "S2\.E(3[6-9])", "7[8-9]|8[0-1]"),
    ("Galaxy 4: ", "S3\.E[1-4](?!\S)", "8[2-5]"),
    ("The Myth Makers: ", "S3\.E[6-9]", "8[7-9]|9[0]"),
    ("The Daleks' Master Plan: ", "S3\.E(1[0-9]|2[0-1])", "9[1-9]|10[0-2]"),
    ("The Massacre: ", "S3\.E(2[2-5])", "10[3-6]"),
    ("The Ark: ", "S3\.E(2[6-9])", "10[7-9]|11[0]"),
    ("The Celestial Toymaker: ", "S3\.E(3[0-3])", "11[1-4]"),
    ("The Gunfighers: ", "S3\.E(3[4-7])", "11[5-8]"),
    ("Invasion of the Dinosaurs: ", "S11\.E[5]", "110")
]

# pg. 2 = war games: ep 8 (june 1, 1969)
# pg. 3 =
other_imdb = [
    "https://www.imdb.com/search/title/?series=tt0056751&sort=release_date,asc&count=250",

    "https://www.imdb.com/search/title/?series=tt0056751&release_date=1969-06-01,&sort=release_date,asc&count=250",

    "https://www.imdb.com/search/title/?series=tt0056751&release_date=1979-01-26,&sort=release_date,asc&count=250"
]

votes = "https://www.imdb.com/search/title/?series=tt0056751&sort=release_date,asc&count=250"


eps_per_season = [42, 39, 45, 43, 40, 44, 25, 25, 26, 26, 26,
                  20, 26, 26, 26, 26, 20, 28, 26, 23, 24, 13, 14, 14, 14, 14]

imdb_votes = []
episode_numbers = []


def createSeasonNumbers():
    s = 0
    for eps in eps_per_season:
        s = s + +1
        season = str(s).zfill(2)
        for i in range(eps):
            i = i + 1
            num = str(i).zfill(2)
            ep_season = "S"+season + "E" + num
            episode_numbers.append(ep_season)


createSeasonNumbers()


def getVotes(wiki_info):
    ep_number = 0
    episode_ratings = []
    episode_votes = []
    episode_runtime = []
    episode_viewers = []

    for webpage in other_imdb:
        # scrape ratings from imdb page by season
        page = requests.get(webpage, headers=headers)  # get page
        # get page content
        soup = BeautifulSoup(page.content, "html.parser")

        # find individual episode code
        episode_wrapper = soup.find_all("div", class_="dli-parent")

        for episode in episode_wrapper:
            ep_name = episode.find("div", class_="dli-ep-title")
            ep_rating = episode.find("span", class_="ipc-rating-star")
            # ep_votes = episode.find(
            #     "div", class_="sc-d80c3c78-0 jPoaKS")
            ep_time = episode.find_all(
                "span", class_="sc-b0691f29-8 ilsLEX dli-title-metadata-item")

            # name
            ep_name = ep_name.text
            # number
            ep_number = ep_number + +1
            # rating
            ep_rating = ep_rating.text
            ep_rating = re.split("\(", ep_rating)
            # votes
            # ep_votes = ep_votes.text
            # ep_votes = re.sub("[Votes |,]", "", ep_votes)
            # runtime
            ep_time = ep_time[1].text

            # add info to dict
            extra_info = dict()
            extra_info["EpisodeName"] = ep_name
            extra_info["EpisodeNumber"] = ep_number
            for index, eps in enumerate(episode_numbers):
                if index + 1 == ep_number:
                    extra_info["EpisodeSeason"] = eps

            extra_info["EpisodeRating"] = ep_rating[0].strip()
            # extra_info["EpisodeVotes"] = ep_votes.strip()
            extra_info["EpisodeTime"] = ep_time

            # add each entry to a list
            imdb_votes.append(extra_info)

            for info in wiki_info["EpisodeInfo"]:
                if re.search(ep_name, info["EpisodeName"]):

                    # add story title to episode name
                    if int(wiki_info["Number"]) < 26:
                        title = wiki_info["Title"]
                        extra_info["EpisodeName"] = title + ": " + ep_name
                    info.update(extra_info)

                    # calculate average rating of each episode
                    episode_ratings.append(float(extra_info["EpisodeRating"]))
                    average_rating = sum(episode_ratings)/len(episode_ratings)
                    average_rating = round(average_rating, 1)
                    # add average rating to wiki_info dict
                    wiki_info["IMDBRating"] = average_rating

                    # add together individual episode votes
                    # episode_votes.append(int(extra_info["EpisodeVotes"]))
                    # total_votes = sum(episode_votes)
                    # wiki_info["IMDBVotes"] = total_votes

                    # add together viewership
                    episode_viewers.append(float(info["EpisodeViewers"]))
                    total_viewers = sum(episode_viewers)
                    total_viewers = round(total_viewers, 1)
                    wiki_info["TotalViewers"] = total_viewers

                    # add together episode runtimes
                    if (wiki_info["Title"] != "The Five Doctors"):
                        ep_runtime = re.sub(
                            "m", "", ep_time)

                        episode_runtime.append(int(ep_runtime))
                        total_runtime = sum(episode_runtime)

                        # convert total runtime to hours and minutes
                        hours = total_runtime // 60
                        mins = total_runtime % 60
                        total_runtime = "{}h {}m".format(hours, mins)
                        wiki_info["TotalRuntime"] = total_runtime
                    else:
                        wiki_info["TotalRuntime"] = ep_time

                    # print(info)


# getVotes(wiki_info)


def getRatings(URL, wiki):
    # additive lists where each episode's individual ratings need to be added together
    episode_ratings = []
    episode_votes = []
    episode_runtime = []

    # scrape ratings from imdb page by season
    page = requests.get(URL, headers=headers)  # get page
    # get page content
    soup = BeautifulSoup(page.content, "html.parser")
    # dom = etree.HTML(str(soup))

    # find individual episode code
    episode_wrapper = soup.find_all("article", class_="episode-item-wrapper")
    # set EpisodeInfo key
    wiki.setdefault("EpisodeInfo", [])

    for episode in episode_wrapper:
        # get relevant code
        ep_info = episode.find("div", class_="ipc-title__text")
        ep_rating = episode.find("span", class_="ipc-rating-star")
        ep_airdate = episode.find("span", class_="sc-f2169d65-10 iZXnmI")
        # get text from code
        ep_info = ep_info.text
        ep_rating = ep_rating.text
        ep_airdate = ep_airdate.text

        # split apart episode number from title
        info = re.split("∙", ep_info)
        episode_number = info[0].strip()
        episode_name = info[1].strip()
        # add episode number to dict
        ratings_info["EpisodeNumber"] = episode_number
        # add default episode name to dict
        ratings_info["EpisodeName"] = episode_name

        # split apart day from date
        airdate = re.split(
            "Sat, |Sun, |Mon, |Tue, |Wed, |Thu, |Fri, ", ep_airdate)
        episode_date = airdate[1].strip()
        # add episode date into dict
        ratings_info["EpisodeDate"] = episode_date

        # split apart rating + number of ratings
        rating = re.split("/|\(|\)", ep_rating)
        episode_rating = rating[0]
        episode_num = rating[2]
        # add episode rating and # of ratings to dict
        ratings_info["EpisodeRating"] = episode_rating

        # matches certain episodes without story name and adds their name to them
        # addStoryName(episode_name, episode_number, ratings_info, wiki)

        # search again to make sure name of story matches with episodes
        if re.match(wiki["Title"] + ":", ratings_info["EpisodeName"]):

            # calculate average rating of each episode
            episode_ratings.append(float(episode_rating))
            average_rating = sum(episode_ratings)/len(episode_ratings)
            average_rating = round(average_rating, 1)
            # add average rating to wiki_info dict
            wiki["IMDBRating"] = average_rating

            # go through extra_info from other imdb pages
            for entry in imdb_votes:
                # match episode names
                if re.match(entry["EpisodeName"], ratings_info["EpisodeName"]):
                    # make exception for Invasion of the Dinosaurs Pt.1, set it back to original title
                    if ratings_info["EpisodeName"] == "Invasion of the Dinosaurs: Invasion: Part One":
                        ratings_info["EpisodeName"] = episode_name

                    # add votes and runtime to main dict
                    ratings_info["EpisodeVotes"] = entry["EpisodeVotes"]
                    ratings_info["EpisodeRuntime"] = entry["EpisodeRuntime"]

                    # add together individual episode votes
                    episode_votes.append(int(ratings_info["EpisodeVotes"]))
                    total_votes = sum(episode_votes)
                    wiki["IMDBVotes"] = total_votes

                    # add together individual episode runtimes
                    if ratings_info["EpisodeName"] != "The Five Doctors":
                        # add together episode runtimes
                        ep_runtime = re.sub(
                            "m", "", ratings_info["EpisodeRuntime"])
                        episode_runtime.append(int(ep_runtime))
                        total_runtime = sum(episode_runtime)

                        # convert total runtime to hours and minutes
                        hours = total_runtime // 60
                        mins = total_runtime % 60
                        total_runtime = "{}h {}m".format(hours, mins)
                        wiki["TotalRuntime"] = total_runtime

            # add each episode to story entry
            # wiki["EpisodeInfo"].append(ratings_info.copy())


def addStoryName(episode_name, info, dictionary, wiki):
    """
        Add the official story name to episodes with individual titles

        Parameters
        ----------
        episode_name (string): unique name of episode
        info (string): episode number
        dictionary (dict): relevant dictionary
        wiki (string): title

        Returns
        -------
        "EpisodeName" (string): full episode story and title
    """
    # go through list of stories with unique episode names
    for index, (title, episodes, numbers) in enumerate(story_episodes):
        # if there's a match
        if re.match(episodes, info):
            # add full title
            dictionary["EpisodeName"] = title + episode_name

        if re.match(numbers, info):
            # add full title
            dictionary["EpisodeName"] = title + episode_name


def scrapeImdbPages(wiki):
    # go through each season's imdb page
    for season in range(26):
        imdb_url = "https://www.imdb.com/title/tt0056751/episodes/?season=" + \
            str(season + 1)
        getRatings(imdb_url, wiki)


# create list of votes, runtime, and titles
# getVotes()
# print(imdb_votes)

# scrapeImdbPages(wiki_info)

# for entry, values in wiki_info.items():
#     print(entry, values)


def getOtherInfo():
    """
    Returns:
        _Dictionary_: dictionary of misc categories that are manually added by myself
    """
    other_info = dict()
    other_info.setdefault("Poster")  # string
    other_info.setdefault("Favorite", False)  # boolean
    other_info.setdefault("Essential", False)  # boolean
    # other_info.setdefault("Animated")  # string
    other_info.setdefault("Rating")  # num out of 10
    other_info.setdefault("Villain", [])  # array of strings
    other_info.setdefault("AdditionalTags", [])  # array of strings

    return other_info


other_info = getOtherInfo()


def setRecurringVillainStories(title, other_info):
    # add common recurring villains to story
    # for the master
    for index, (story, actor) in enumerate(the_master):
        if title == story:
            master = "The Master" + " (" + actor + ")"
            other_info["Villain"].append(master)
    # for other villains
    for cyberman, dalek, icewarrior, sontaran in zip_longest(cybermen, daleks, ice_warriors, sontarans):
        if title == cyberman:
            other_info["Villain"].append("Cybermen")
        elif title == dalek:
            other_info["Villain"].append("Daleks")
        elif title == icewarrior:
            other_info["Villain"].append("Ice Warriors")
        elif title == sontaran:
            other_info["Villain"].append("Sontarans")


def setAnimatedStories(title, other_info):
    # determine whether stories with missing episodes are animated or not
    # go through all lists
    for a, b, c in zip_longest(animated, partially_animated, not_animated):
        if title == a:
            other_info["Animated"] = "Full"
        elif title == b:
            other_info["Animated"] = "Partial"
        elif title == c:
            other_info["Animated"] = "Not Animated"


def setAdditionalTags(title, other_info):
    # add additional tags to relevant stories
    for historical in historicals:
        if title == historical:
            other_info["AdditionalTags"] = "Historical"


def setEssentialStories(title, other_info):
    # determine whether stories are essential viewing
    for story, exp in essential_stories:
        if title == story:  # compare title of entry to title in my list
            # set it to true
            other_info["Essential"] = True
            # add key for explanation
            other_info.setdefault("WhyEssential", [])
            other_info["WhyEssential"] = exp


#
# BELOW ARE LISTS FOR EACH CATEGORY
#
# stories that I consider essential
essential_stories = [
    ("An Unearthly Child",
     ["Undoubtably, the first episode of <i>An Unearthly Child</i> is the most important as an introduction to the Doctor, his granddaughter Susan Foreman, and the very first companions ever Ian Chesterton and Barbara Wright. The concept of the TARDIS and the sort of adventures the Doctor and his companions go on is established here.",
      "Some may say that the rest of the episodes — revolving around caveman politics — are not worth the watch. While it's true that they're considerably duller than the first episode, it's pretty fascinating to see where the Doctor started out as a character."]),
    ("The Daleks",
     ["The very next story is where Doctor Who's most iconic villain makes their first appearance: The Daleks. Their planet, Skaro, is established, along with a lot of background lore that is partially retconned in later stories and again in the revival series.",
      "At seven whole episodes, it can't be denied that the pacing drags a litle bit, but it's definitely worth the watch to see one of the finest early science fiction television stories unfold, laden with plenty of then-and-still now relevant political commentary."]),
    ("The Aztecs",
     []),
    ("The Dalek Invasion of Earth",
     []),
    ("The Rescue",
     ["A short but sweet story that introduces Vicki Pallister, whom many would agree had the best dynamic with the first Doctor."]),
    ("The Chase",
     ["The first story to say goodbye to long time companions, Ian Chesterton and Barbara Wright. Also the third appearance of the Daleks and the first one to actually make them a joke."]),
    ("The Time Meddler",
     ["The very first psuedo-historical and first story to introduce another time lord character (before they were coined as such.)"]),
    ("The War Machines",
     []),
    ("The Tenth Planet",
     []),
    ("The Power of the Daleks",
     []),
    ("The Evil of the Daleks",
     []),
    ("The Tomb of the Cybermen",
     []),
    ("The Enemy of the World",
     []),
    ("The Web of Fear",
     []),
    ("The Invasion",
     []),
    ("The War Games",
     []),
    ("Spearhead from Space",
     []),
    ("Doctor Who and the Silurians",
     []),
    ("Inferno",
     []),
    ("Terror of the Autons",
     []),
    ("The Curse of Peladon",
     []),
    ("The Sea Devils",
     []),
    ("The Three Doctors",
     []),
    ("The Green Death",
     []),
    ("The Time Warrior",
     []),
    ("Invasion of the Dinosaurs",
     []),
    ("Planet of the Spiders",
     []),
    ("Robot",
     []),
    ("The Ark in Space",
     []),
    ("Genesis of the Daleks",
     []),
    ("Terror of the Zygons",
     []),
    ("Pyramids of Mars",
     []),
    ("The Hand of Fear",
     []),
    ("The Deadly Assassin",
     []),
    ("The Face of Evil",
     []),
    ("The Robots of Death",
     []),
    ("The Talons of Weng-Chiang",
     []),
    ("The Ribos Operation",
     []),
    ("The Armageddon Factor",
     []),
    ("City of Death",
     []),
    ("Full Circle",
     []),
    ("Warriors' Gate",
     []),
    ("The Keeper of Traken",
     []),
    ("Logopolis",
     []),
    ("Castrovalva",
     []),
    ("The Visitation",
     []),
    ("Earthshock",
     []),
    ("Mawdryn Undead",
     []),
    ("Enlightenment",
     []),
    ("The Five Doctors",
     []),
    ("Resurrection of the Daleks",
     []),
    ("Planet of Fire",
     []),
    ("The Caves of Androzani",
     []),
    ("The Twin Dilemma",
     []),
    ("Vengeance on Varos",
     []),
    ("The Mark of the Rani",
     []),
    ("The Two Doctors",
     []),
    ("The Mysterious Planet",
     []),
    ("Mindwarp",
     []),
    ("Terror of the Vervoids",
     []),
    ("The Ultimate Foe",
     []),
    ("Dragonfire",
     []),
    ("Remembrance of the Daleks",
     []),
    ("Battlefield",
     []),
    ("Survival",
     [])
]

# stories that are my favorites
favorite_stories = ["The Daleks", "The Edge of Destruction", "The Keys of Marinus",
                    "Planet of Giants", "The Romans", "The Chase", "The Power of the Daleks", "The Moonbase", "The Tomb of the Cybermen", "The Enemy of the World", "The Web of Fear", "The Mind Robber", "The Seeds of Death", "The War Games", "Spearhead from Space", "Inferno", "The Cuese of Peladon", "Carnival of Monsters", "The Green Death", "The Time Warrior", "The Monster of Peladon", "Terror of the Zygons", "The Seeds of Doom", "The Robots of Death", "Horror of Fang Rock", "The Sun Makers", "City of Death", "The Leisure Hive", "The Visitation", "Mawdryn Undead", "The Caves of Androzani", "The Mark of the Rani", "Battlefield"]

# missing stories that have been fully animated
animated = ["Galaxy 4", "The Power of the Daleks", "The Macra Terror", "The Faceless Ones", "The Evil of The Daleks",
            "The Abominable Snowmen", "Fury from the Deep"]

# missing stories that are partially animated
partially_animated = ["The Reign of Terror",
                      "The Tenth Planet", "The Underwater Menace", "The Moonbase", "The Ice Warriors", "The Web of Fear", "The Wheel in Space", "The Invasion", "Shada"]


# missing stories that HAVEN'T been animated
not_animated = ["Marco Polo", "The Crusade",
                "Mission to the Unknown", "The Myth Makers", "The Daleks' Master Plan", "The Massacre", "The Celestial Toymaker", "The Savages", "The Smugglers", "The Highlanders", "The Space Pirates"]

#
# BELOW ARE STORIES ORGANIZED BY MY OWN RATINGS OUT OF 10 / USES A 20 POINT SCALE TO ALLOW FOR .5
#

# 10/10
ten = []
# 9.5/10
nine_five = []
# 9/10
nine = []
# 8.5/10
eight_five = []
# 8/10
eight = []
# 7.5/10
seven_five = []
# 7/10
seven = []
# 6.5/10
six_five = []
# 6/10
six = []
# 5.5/10
five_five = []
# 5/10
five = []
# 4.5/10
four_five = []
# 4/10
four = []
# 3.5/10
three_five = []
# 3/10
three = []
# 2.5/10
two_five = []
# 2/10
two = []
# 1.5/10
one_five = []
# 1/10
one = []

#
# RECURRING VILLAINS IN DOCTOR WHO, LISTED IN ALPHABETICAL ORDER
#

villains = {
    "The Daleks": [
        "Daleks"
    ],
    "The Dalek Invasion of Earth": [
        "Daleks"
    ]
}

cybermen = ["The Tenth Planet", "The Moonbase",
            "The Tomb of the Cybermen", "The Wheel in Space", "The Invasion", "Revenge of the Cybermen", "Earthshock", "The Five Doctors", "Attack of the Cybermen", "Silver Nemesis"]
daleks = ["The Daleks", "The Dalek Invasion of Earth", "The Chase", "Mission to the Unknown", "The Daleks' Master Plan", "The Power of the Daleks", "The Evil of the Daleks", "The Wheel in Space",
          "Day of the Daleks", "Planet of the Daleks", "Death to the Daleks", "Genesis of the Daleks", "Destiny of the Daleks", "The Five Doctors", "Resurrection of the Daleks", "Revelation of the Daleks", "Remembrance of the Daleks"]
ice_warriors = ["The Ice Warriors",
                "The Seeds of Death", "The Curse of Peladon", "The Monster of Peladon"]
sontarans = ["The Time Warrior", "The Sontaran Experiment",
             "The Invasion of Time", "The Two Doctors"]
the_master = [("Terror of the Autons", "Delgado"), ("The Mind of Evil", "Delgado"), ("The Claws of Axos", "Delgado"), ("Colony in Space",
                                                                                                                       "Delgado"), ("The Dæmons", "Delgado"), ("The Sea Devils", "Delgado"), ("The Time Monster", "Delgado"), ("Frontier in Space", "Delgado"), ("The Deadly Assassin", "Decayed"), ("The Keeper of Traken", "Decayed"), ("The Keeper of Traken", "Ainley"), ("Logopolis", "Ainley"), ("Castrovalva", "Ainley"), ("Time-Flight", "Ainley"), ("Logopolis", "Ainley"), ("The King's Demons", "Ainley"), ("The Five Doctors", "Ainley"), ("Planet of Fire", "Ainley"), ("The Caves of Androzani", "Ainley"), ("The Mark of the Rani", "Ainley"), ("The Ultimate Foe", "Ainley"), ("Survival", "Ainley")]

#
# ADDITIONAL TAGS GO HERE
#
historicals = ["Marco Polo", "The Aztecs",
               "The Reign of Terror", "The Romans", "The Chase", "The Time Meddler", "The Myth Makers", "The Massacre", "The Gunfighters", "The Highlanders", "The Abominable Snowmen", "The War Games", "The Time Warrior", "Pyramids of Mars", "The Masque of Mandragora", "The Talons of Weng-Chiang", "The Visitation", "Black Orchid", "The King's Demons", "The Mark of the Rani", "Delta and the Bannermen", "Remembrance of the Daleks", "Ghost Light", "The Curse of Fenric"]
#
