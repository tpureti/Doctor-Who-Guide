def getOtherInfo():
    """
    Returns:
        _Dictionary_: dictionary of misc categories that are manually added by myself
    """
    other_info = dict()
    other_info.setdefault("Poster")
    other_info.setdefault("Favorite", False)  # boolean
    other_info.setdefault("Essential", False)  # boolean
    other_info.setdefault("Rating")  # num out of 10
    other_info.setdefault("Villain", [])
    other_info.setdefault("Additional Tags", [])

    return other_info


#
# BELOW ARE LISTS FOR EACH CATEGORY
#

# stories that I consider essential
essential_stories = ["An Unearthly Child", "The Daleks", "The Edge of Destruction",
                     "The Aztecs", "The Dalek Invasion of Earth", "The Rescue", "The Chase", "The Time Meddler", "The Daleks' Master Plan", "The War Machines", "The Tenth Planet", "The Power of the Daleks", "The Highlanders", "The Faceless Ones", "The Evil of the Daleks", "The Tomb of the Cybermen", "The Enemy of the World", "The Web of Fear", "The Wheel in Space", "The Invasion", "The War Games"]

# stories that are my favorites
favorite_stories = ["The Daleks", "The Edge of Destruction", "The Keys of Marinus",
                    "Planet of Giants", "The Romans", "The Chase", "The Power of the Daleks", "The Moonbase", "The Tomb of the Cybermen", "The Enemy of the World", "The Web of Fear", "The Mind Robber", "The Seeds of Death", "The War Games"]

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
zygon = []

#
# ADDITIONAL TAGS GO HERE
#
historicals = []
