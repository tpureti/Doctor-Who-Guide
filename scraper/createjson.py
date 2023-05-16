from wiki_info import getWikiInfo
from fandom_info import getFandomInfo
from other_cats import getOtherInfo, essential_stories, favorite_stories
from links import links
import json


def setEssentialStories(title, other_info):
    # determine whether stories are essential viewing
    for story in essential_stories:
        if title == story:  # compare title of entry to title in my list
            other_info["Essential"] = True


def setFavoriteStories(title, other_info):
    # determine whether stories are my favorites
    for story in favorite_stories:
        if title == story:  # compare title of entry to title in my list
            other_info["Favorite"] = True


# def combineDictionaries():
#     # combine all dictionaries
#     for index, (wiki, fandom) in enumerate(links):
#         # initalize dictionaries
#         wiki_info = getWikiInfo(wiki)
#         fandom_info = getFandomInfo(fandom)
#         other_info = getOtherInfo()
#         # title of stories
#         title = wiki_info["Title"]
#         # set other/misc categories
#         setEssentialStories(title, other_info)  # set essential status
#         setFavoriteStories(title, other_info)  # set fave status
#         # create dictionary of everything
#         DW_STORIES = {**wiki_info, **fandom_info, **other_info}
#         print(DW_STORIES)
#         print()


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
            # title of stories
            title = wiki_info["Title"]
            # set other/misc categories
            setEssentialStories(title, other_info)  # set essential status
            setFavoriteStories(title, other_info)  # set fave status
            # create dictionary of everything
            DW_STORIES = {**wiki_info, **fandom_info, **other_info}
            # write dict to file
            json.dump(DW_STORIES, jsonfile, indent=4)

            # unless it's last entry insert comma between entries
            if index != len(links) - 1:
                jsonfile.write(",")

        # final bracket
        jsonfile.write("]")


createJSONFile()

# with open("stories.json") as json_file:
#     data = json.load(json_file)
#     data = sorted(data, key=lambda x: x["Number"])
#     for info in data:
#         print(info["Number"])
