import requests
from bs4 import BeautifulSoup
from lxml import etree
import re
from datetime import datetime, date


def getWikiInfo(URL):
    page = requests.get(URL)  # get page
    # get page content
    soup = BeautifulSoup(page.content, "html.parser")
    # dom = etree.HTML(str(soup))

    # info table
    info_table = soup.find("table", class_="infobox vevent")
    table_entries = info_table.find_all("td", class_="infobox-full-data")
    table_rows = info_table.find_all("tr")

    # dictionary of basic info
    basic_info = dict()

    def getBasicInfo():
        header = info_table.find("th", class_="infobox-above summary")
        content = header.text
        info = re.split(" – | — ", content)
        # get story number
        number = info[0]
        # get story title
        title = info[1]
        # remove any annotations
        num = re.split("\[[0-9a-z]\]|\((uncredited)\)", number)
        number = num[0]
        title = title.replace('"', "")
        # add to dict
        basic_info['Number'] = number
        basic_info['Title'] = title

    getBasicInfo()

    # dictionary of cast list
    cast_info = dict()
    # cast categories
    doc = 'Doctor'
    com = 'Companion'
    ch = 'Characters'
    actors = 'Actors'
    # allow multiple entries
    cast_info.setdefault(actors, [])

    def getCast():
        # function to get doctor and companion info
        """
        """
        for row in table_entries:
            category = row.find("b")
            list = row.find_all("li")

            # print doctor and companions
            for item in row:
                # get list of actors
                for i in list:
                    # get text from each line
                    content = i.text
                    # split by dash
                    name = re.split("–|—|\(Voice of|\)", content)

                    # get actor name
                    actor = name[0].strip()
                    # if there are multiple actors split by comma
                    actor = re.split(",", actor)
                    for actrs in actor:
                        # to avoid repeats
                        actrs = re.split(
                            "\[[0-9a-z]\]", actrs)
                        actrs = actrs[0].strip()
                        if actrs not in cast_info[actors]:
                            cast_info[actors].append(actrs)
                            # print(actrs)

                    cat = category.text
                    # get the doctor(s)
                    if re.match("Doctor|Doctors", cat):
                        cast_info.setdefault(doc, [])
                        doctor = name[1].strip()
                        # add to dict
                        cast_info[doc].append(doctor)
                    # get the companion(s)
                    if re.match("Companion|Companions|Cast", cat):
                        cast_info.setdefault(com, [])
                        companion = name[1].strip()
                        companion = re.split(
                            "\[[0-9a-z]\]|\((uncredited)\)", companion)

                        companion = re.sub("Voice of ", "", companion[0])
                        # replace Vicki's name with her full name
                        if (companion == "Vicki"):
                            companion = companion.replace(
                                "Vicki", "Vicki Pallister")
                        # add to dict
                        cast_info[com].append(companion)
                    # get the rest of the cast
                    if re.match("Others|Starring", cat):
                        cast_info.setdefault(ch, [])
                        character = name[1].strip()
                        # strip away annotations
                        chara = re.split(
                            "\[[0-9a-z]\]|\((uncredited)\)", character)
                        character = chara[0]
                        # include brigadier, yates, and benton in companion list
                        if re.match("Brigadier Lethbridge-Stewart|Captain Mike Yates|Sergeant Benton", character):
                            # don't repeat names
                            if character not in cast_info[com]:
                                cast_info[com].append(character)
                        # add to dict
                        else:
                            # split up if there are multiple names
                            character = re.split("/", character)
                            for chs in character:
                                chs = chs.strip()
                                # to avoid repeats
                                if chs not in cast_info[ch]:
                                    cast_info[ch].append(chs)

    # function to get cast members
    getCast()

    # PRODUCTION INFO VARIABLES
    director = "Directed by"
    writer = "Written by"
    script_editor = "Script editor"
    producer = "Produced by"
    composer = 'Music by'
    series = "Series"
    running_time = "Running time"
    missing_episodes = "Episode(s) missing"

    # production info dictionary
    prod_info = dict()

    def getProductionInfo(production_info):
        # get production info
        for row in table_rows:
            production = row.find("th", class_="infobox-label")
            data = row.find("td", class_="infobox-data")

            if production != None:
                # if there's only one name
                if (production.string == production_info):
                    # if there's a link
                    lists = row.find_all("li")
                    links = row.find_all("a")
                    br = row.find("br")

                    # change keys so they have no spaces
                    production_info = changeDictKeys(production_info)
                    # set key to default
                    prod_info.setdefault(production_info, [])

                    if (lists or links):
                        for info in links:
                            # if there's a break split up names
                            if (br):
                                multi_info = info.get_text("&").split("&")
                                for add_info in multi_info:
                                    # if it's not an annotation
                                    if not re.match(
                                            "\[[0-9a-z]\]|\((uncredited)\)", add_info):
                                        prod_info[production_info].append(
                                            add_info.strip())
                            # if there's multiple names
                            else:
                                # print(data.text)
                                txt = info.text
                                # if it's not an annotation
                                if not re.match(
                                        "\[[0-9a-z]\]|\((uncredited)\)", txt):
                                    prod_info[production_info].append(
                                        txt.strip())
                    # if there's just one name
                    else:
                        txt = data.text
                        txt = re.split("\[[0-9a-z]\]|\((uncredited)\)", txt)
                        prod_info[production_info] = txt[0].strip()

                    # missing episodes
                    if production.string == missing_episodes:
                        txt = data.text
                        prod_info[production_info] = txt

                    # episodes
                    if production.string == running_time:
                        episodes = data.contents
                        num = int(basic_info["Number"][:3])
                        # if story number is below 50 ignore
                        if num < 50:
                            episodes = re.split(
                                "episode|episodes", episodes[0])
                            episodes = episodes[0]
                            episodes = episodes.strip()
                            return episodes

    def changeDictKeys(prod_info_key):
        # changes keys so they don't have spaces
        if prod_info_key == director:
            prod_info_key = "Director"
        elif prod_info_key == writer:
            prod_info_key = "Writer"
        elif prod_info_key == script_editor:
            prod_info_key = "ScriptEditor"
        elif prod_info_key == producer:
            prod_info_key = "Producer"
        elif prod_info_key == composer:
            prod_info_key = "Music"
        elif prod_info_key == series:
            prod_info_key = "Season"
        elif prod_info_key == missing_episodes:
            prod_info_key = "MissingEpisodes"

        return prod_info_key

    # production info
    getProductionInfo(director)
    getProductionInfo(writer)
    getProductionInfo(script_editor)
    getProductionInfo(producer)
    getProductionInfo(composer)
    getProductionInfo(series)
    getProductionInfo(missing_episodes)

    def getEpsAndMissingEps():
        # get series number
        if (basic_info['Title'] == 'The Five Doctors'):
            # the five doctors exceptions
            prod_info["Season"] = '20'
        else:
            series_number = prod_info["Season"]
            series_num = series_number[0].split("Season ")
            prod_info["Season"] = series_num[1]

        # if there are missing episodes
        episodes = getProductionInfo(running_time)

        if "MissingEpisodes" in prod_info:
            missing_eps = prod_info["MissingEpisodes"]
            # remove superfluous text
            missing_eps = re.split("episode|episodes", missing_eps)
            missing_eps = missing_eps[0].strip()
            prod_info["MissingEpisodes"] = missing_eps
            # if all eps are missing, remove "all"
            if re.match("All", prod_info["MissingEpisodes"]):
                # all_eps_missing = missing_eps.split("All")
                # all_eps = all_eps_missing[1].strip()
                prod_info["MissingEpisodes"] = episodes

    getEpsAndMissingEps()

    episode_info = []

    def getEpisodeInfo():
        # find table of episodes
        episode_table = soup.find(
            "table", class_="wikitable plainrowheaders wikiepisodetable")
        rows = episode_table.find_all("tr")

        for row in rows[1:]:
            info = dict()
            # find cells in each row
            cells = row.find_all("td")

            ep_name = cells[0].text
            ep_time = cells[1].text
            ep_date = cells[2].text
            ep_viewers = cells[3].text

            if basic_info["Title"] == "Shada":
                ep_time = cells[2].text
                ep_date = cells[3].text
                ep_viewers = "0"

            # if episode is missing add status
            if re.search("†", ep_name):
                info["EpisodeStatus"] = "Missing"

            ep_name = re.sub("\"|\(|\)|missing|†|titled|Invasion", "", ep_name)
            ep_name = ep_name.strip()
            ep_date = re.split("\(|\)", ep_date)
            ep_date = ep_date[1]
            # print(ep_date)

            if basic_info["Title"] != "Invasion of the Dinosaurs" or ep_name != "Part One":
                info["EpisodeName"] = basic_info["Title"] + \
                    ": " + ep_name
            else:
                info["EpisodeName"] = "Invasion: " + ep_name

            if basic_info["Title"] == "The Five Doctors":
                info["EpisodeName"] = ep_name

            info["EpisodeRuntime"] = ep_time
            info["EpisodeDate"] = ep_date
            ep_viewers = re.sub("\[\d\]", "",  ep_viewers)
            info["EpisodeViewers"] = ep_viewers

            episode_info.append(info)

        prod_info["FirstBroadcast"] = episode_info[0]["EpisodeDate"]
        if len(episode_info) > 1:
            prod_info["LastBroadcast"] = episode_info[-1]["EpisodeDate"]

    getEpisodeInfo()

    # remove runtime
    prod_info.pop(running_time)

    wiki_info = {**basic_info, **cast_info, **prod_info}
    wiki_info["EpisodeInfo"] = episode_info

    return wiki_info


URL = "https://en.wikipedia.org/wiki/Invasion_of_the_Dinosaurs"
wiki_info = getWikiInfo(URL)

# for entry, values in wiki_info.items():
#     print(entry, values)
