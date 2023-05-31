def getOtherInfo():
    """
    Returns:
        _Dictionary_: dictionary of misc categories that are manually added by myself
    """
    other_info = dict()
    other_info.setdefault("Poster")  # string
    other_info.setdefault("Favorite", False)  # boolean
    other_info.setdefault("Essential", False)  # boolean
    # other_info.setdefault("Animated")  # boolean
    other_info.setdefault("Why_Essential", [])  # string
    other_info.setdefault("Rating")  # num out of 10
    other_info.setdefault("Villain", [])  # array of strings
    other_info.setdefault("Additional_Tags", [])  # array of strings

    return other_info


#
# BELOW ARE LISTS FOR EACH CATEGORY
#

# stories that I consider essential
essential_stories = ["An Unearthly Child", "The Daleks", "The Edge of Destruction",
                     "The Aztecs", "The Dalek Invasion of Earth", "The Rescue", "The Chase", "The Time Meddler", "The War Machines", "The Tenth Planet", "The Power of the Daleks", "The Faceless Ones", "The Evil of the Daleks", "The Tomb of the Cybermen", "The Enemy of the World", "The Web of Fear", "The Wheel in Space", "The Invasion", "The War Games", "Spearhead from Space", "Doctor Who and the Silurians", "Inferno", "	Terror of the Autons", "The Curse of Peladon", "The Sea Devils", "The Three Doctors", "The Green Death", "The Time Warrior", "Invasion of the Dinosaurs", "Planet of the Spiders", "Robot", "The Ark in Space", "Genesis of the Daleks", "Terror of the Zygons", "Pyramids of Mars", "The Hand of Fear", "The Deadly Assassin", "The Face of Evil", "The Robots of Death", "The Talons of Weng-Chiang", "The Ribos Operation", "The Armageddon Factor", "City of Death", "Full Circle", "Warriors' Gate", "The Keeper of Traken", "Logopolis", "Castrovalva", "The Visitation", "Earthshock", "Mawdryn Undead", "Enlightenment", "The Five Doctors", "Resurrection of the Daleks", "Planet of Fire", "The Caves of Androzani", "The Twin Dilemma", "Vengeance on Varos", "The Mark of the Rani", "The Two Doctors", "The Mysterious Planet", "Mindwarp", "Terror of the Vervoids", "The Ultimate Foe", "Dragonfire", "Remembrance of the Daleks", "Battlefield", "Survival"]

# stories that are my favorites
favorite_stories = ["The Daleks", "The Edge of Destruction", "The Keys of Marinus",
                    "Planet of Giants", "The Romans", "The Chase", "The Power of the Daleks", "The Moonbase", "The Tomb of the Cybermen", "The Enemy of the World", "The Web of Fear", "The Mind Robber", "The Seeds of Death", "The War Games", "Spearhead from Space", "Inferno", "The Cuese of Peladon", "Carnival of Monsters", "The Green Death", "The Time Warrior", "The Monster of Peladon", "Terror of the Zygons", "The Seeds of Doom", "The Robots of Death", "Horror of Fang Rock", "The Sun Makers", "City of Death", "The Leisure Hive", "The Visitation", "Mawdryn Undead", "The Caves of Androzani", "The Mark of the Rani", "Battlefield"]

# missing stories that HAVE been animated
animated = ["The Reign of Terror", "Galaxy 4", "The Tenth Planet",
            "The Power of the Daleks", "The Moonbase", "The Macra Terror", "The Faceless Ones", "The Evil of The Daleks", "The Abominable Snowmen", "The Ice Warriors", "The Web of Fear", "Fury from the Deep", "The Wheel in Space", "The Invasion"]

# missing stories that HAVEN'T been animated
not_animated = ["Marco Polo", "The Crusade",
                "Mission to the Unknown", "The Myth Makers", "The Daleks' Master Plan", "The Massacre", "The Celestial Toymaker", "The Savages", "The Smugglers", "The Highlanders", "The Underwater Menace", "The Space Pirates"]

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
cybermen = []
daleks = []
davros = []
ice_warriors = []
sontarans = []
the_master = []
zygons = []

#
# ADDITIONAL TAGS GO HERE
#
historicals = []
