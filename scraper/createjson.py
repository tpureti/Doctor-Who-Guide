from wiki_info import getWikiInfo
from fandom_info import getFandomInfo
from other_cats import getVotes, getOtherInfo, scrapeImdbPages, setRecurringVillainStories, setAnimatedStories, setAdditionalTags, setEssentialStories, favorite_stories
from links import links
import json
import glob
import re
import itertools


def setPosterPaths(number, other_info):
    # link to posters path
    folder_path = '../posters'
    # get files from posters folder
    files = glob.glob(folder_path + '/*.jpg')
    # loop through folder
    for file in files:
        # remove fluff at beginning
        file = file.split("../")
        file = file[1]
        # if story number matches, match to correct file
        if re.search(number, file):
            # set poster to file extension
            other_info["Poster"] = file


def setFavoriteStories(title, other_info):
    # determine whether stories are my favorites
    for story in favorite_stories:
        if title == story:  # compare title of entry to title in my list
            other_info["Favorite"] = True


def combineDictionaries():
    # combine all dictionaries
    for index, (wiki, fandom) in enumerate(links):
        # initalize dictionaries
        wiki_info = getWikiInfo(wiki)
        fandom_info = getFandomInfo(fandom)
        other_info = getOtherInfo()
        getVotes(wiki_info)

        # keys
        title = wiki_info["Title"]
        number = wiki_info["Number"]

        # set other/misc categories
        setPosterPaths(number, other_info)  # set posters
        setEssentialStories(title, other_info)  # set essential status
        setFavoriteStories(title, other_info)  # set fave status
        setAnimatedStories(title, other_info)  # set animated status
        setRecurringVillainStories(title, other_info)  # set villains
        setAdditionalTags(title, other_info)  # set misc tags

        # print(other_info.items())

        # create dictionary of everything
        DW_STORIES = {**wiki_info, **fandom_info, **other_info}
        print(DW_STORIES)
        print()


# combineDictionaries()


def createJSONFile():
    # write dictionaries into json file
    with open("stories.json", "w") as jsonfile:
        # starting bracket
        jsonfile.write("[")

        # cycle through links
        for index, (wiki, fandom) in enumerate(links):
            # initalize dictionaries
            wiki_info = getWikiInfo(wiki)
            fandom_info = getFandomInfo(fandom)
            other_info = getOtherInfo()
            getVotes(wiki_info)

            # keys
            title = wiki_info["Title"]
            number = wiki_info["Number"]

            # set other/misc categories
            setPosterPaths(number, other_info)  # set posters
            setEssentialStories(title, other_info)  # set essential status
            setFavoriteStories(title, other_info)  # set fave status
            setAnimatedStories(title, other_info)  # set animated status
            setRecurringVillainStories(title, other_info)  # set villains
            setAdditionalTags(title, other_info)  # set misc tags

            # create dictionary of everything
            DW_STORIES = {**wiki_info, **fandom_info, **other_info}
            # write dict to file
            json.dump(DW_STORIES, jsonfile, indent=5)

            # unless it's last entry insert comma between entries
            if index != len(links) - 1:
                jsonfile.write(",")

        # final bracket
        jsonfile.write("]")


# create the JSON File
createJSONFile()

# with open("stories.json") as json_file:
#     data = json.load(json_file)
#     data = sorted(data, key=lambda x: x["Number"])
#     for info in data:
#         print(info["Number"])
