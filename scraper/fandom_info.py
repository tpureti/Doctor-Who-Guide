import requests
from bs4 import BeautifulSoup
from lxml import etree
from datetime import datetime, date
import re


def getFandomInfo(URL):
    page = requests.get(URL)  # get page
    # get page content
    soup = BeautifulSoup(page.content, "html.parser")

    fandom = dict()
    summary = 'Summary'
    episodes = 'Episodes'
    first_broadcast = 'First broadcast'
    last_broadcast = 'Last broadcast'
    fandom.setdefault(summary, [])

    def getEpisodeNumber():
        # get number of episodes
        info = soup.find(attrs={"data-source": "epcount"})
        parts = info.find("div")
        eps = parts.text
        fandom[episodes] = eps
        # the shada exception
        if URL == "https://tardis.fandom.com/wiki/Shada_(TV_story)":
            fandom[episodes] = "6"

    def getDates():
        info = soup.find(attrs={"data-source": "broadcast date"})
        broadcast = info.find("div")
        air_dates = broadcast.text

        # if there's multiple air dates
        if re.search("-", air_dates):
            # get dates
            dates = re.split("-", air_dates)
            first_date = dates[0].strip()
            last_date = dates[1].strip()
            # get last date first
            last = datetime.strptime(last_date, "%d %B %Y")
            last = last.date()
            # check how much info is given in first date
            intial_date = first_date.split(" ")
            # get first date
            if len(intial_date) == 3:
                # if day / month / year
                first = datetime.strptime(first_date, "%d %B %Y")
                first = first.date()
            elif len(intial_date) == 2:
                # if day / month
                first = first_date + str(last.year)
                first = datetime.strptime(first, "%d %B%Y")
                first = first.date()
            elif len(intial_date) == 1:
                # if only day
                first = first_date + str(last.month) + str(last.year)
                first = datetime.strptime(first, "%d%m%Y")
                first = first.date()

            # add to dictionary
            fandom[first_broadcast] = first.isoformat()
            fandom[last_broadcast] = last.isoformat()
        # if there's just one air date
        else:
            date = datetime.strptime(air_dates, "%d %B %Y")
            date = date.date()
            # add to dictionary
            fandom[first_broadcast] = date.isoformat()

    def getSummary():
        # get synopsis or summary
        synopsis = soup.find(id="Synopsis")
        sum = soup.find(id="Summary")
        # check whether header is 'synopsis' or 'summary'
        if synopsis:
            text = synopsis.find_all_next()
        else:
            text = sum.find_all_next()
        # get paragraphs under header
        for info in text:
            # if the next header is 'Plot' stop loop
            if info.text == "Plot[]":
                break
            else:  # otherwise continue and get summary
                if info.name == "p":
                    fandom[summary].append(info.text)

    # get number of episodes
    getEpisodeNumber()
    # get first and last dates UNLESS it's shada
    if URL != "https://tardis.fandom.com/wiki/Shada_(TV_story)":
        getDates()
    else:
        fandom[first_broadcast] = "2018-06-18"
    # get summary
    getSummary()

    return fandom


# URL = "https://tardis.fandom.com/wiki/Warriors_of_the_Deep_(TV_story)"

# fandom = getFandomInfo(URL)
# print(fandom)
