import requests
from bs4 import BeautifulSoup
from lxml import etree
import re
from datetime import datetime, date


def getWikiInfo(URL):
    page = requests.get(URL)  # get page
    # get page content
    soup = BeautifulSoup(page.content, "html.parser")
    dom = etree.HTML(str(soup))

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
    cast_info.setdefault(doc, [])
    cast_info.setdefault(com, [])
    cast_info.setdefault(ch, [])
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
                        if actor not in cast_info[actors]:
                            actrs = re.split(
                                "\[[0-9a-z]\]|\((uncredited)\)", actrs)
                            actrs = actrs[0]
                            cast_info[actors].append(actrs.strip())

                    cat = category.text
                    # get the doctor(s)
                    if re.match("Doctor|Doctors", cat):
                        doctor = name[1].strip()
                        # add to dict
                        cast_info[doc].append(doctor)
                    # get the companion(s)
                    if re.match("Companion|Companions", cat):
                        companion = name[1].strip()
                        companion = re.split(
                            "\[[0-9a-z]\]|\((uncredited)\)", companion)
                        # add to dict
                        cast_info[com].append(companion[0])
                    # get the rest of the cast
                    if re.match("Others", cat):
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
                                # to avoid repeats
                                if chs not in cast_info[ch]:
                                    cast_info[ch].append(chs.strip())

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
            prod_info_key = "Script_Editor"
        elif prod_info_key == producer:
            prod_info_key = "Producer"
        elif prod_info_key == composer:
            prod_info_key = "Music"
        elif prod_info_key == series:
            prod_info_key = "Season"
        elif prod_info_key == missing_episodes:
            prod_info_key = "Missing_Episodes"

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

        if "Missing_Episodes" in prod_info:
            missing_eps = prod_info["Missing_Episodes"]
            # remove superfluous text
            missing_eps = re.split("episode|episodes", missing_eps)
            missing_eps = missing_eps[0].strip()
            prod_info["Missing_Episodes"] = missing_eps
            # if all eps are missing, remove "all"
            if re.match("All", prod_info["Missing_Episodes"]):
                # all_eps_missing = missing_eps.split("All")
                # all_eps = all_eps_missing[1].strip()
                prod_info["Missing_Episodes"] = episodes

    getEpsAndMissingEps()

    # remove runtime
    prod_info.pop(running_time)

    wiki_info = {**basic_info, **cast_info, **prod_info}

    return wiki_info


# URL = "https://en.wikipedia.org/wiki/Marco_Polo_(Doctor_Who)"
# wiki = getWikiInfo(URL)
# print(wiki)
