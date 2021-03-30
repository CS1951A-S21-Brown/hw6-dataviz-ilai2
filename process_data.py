import pandas as pd
pd.options.mode.chained_assignment = None


def process_graph_1(dirname):
    with open(dirname, 'rt') as f:
        df = pd.read_csv(f)
        df["date"] = df["date"].transform(
            lambda x: x.split("-")[0]
        )
        df["home_team"] = df["home_team"].transform(lambda x: 1)
        df = df.loc[:, ["date", "home_team"]].groupby(['date']).sum()
    return df.rename({"home_team": "num_games"}, axis="columns")


def process_graph_2(dirname):
    with open(dirname, 'rt') as f:
        df = pd.read_csv(f)
        df["date"] = df["date"].transform(
            lambda x: int(x.split("-")[0])
        )
        years = [2014, 2018]
        df = df[df["tournament"] == "FIFA World Cup"]
        df = df[df.date.isin(years)]

        df_home = df[df["home_score"] > df["away_score"]]
        df_home["winner"] = df_home["home_team"]
        df_away = df[df["home_score"] < df["away_score"]]
        df_away["winner"] = df_away["away_team"]
        df = pd.concat([df_home, df_away])
        # df["winner"] = df["home_score"] if (
        #     df.home_score.ge(df.away_score)) else df["away_score"]
        df["neutral"] = df["neutral"].transform(lambda x: 1)
        df = df.loc[:, ["winner", "neutral"]].groupby(['winner']).sum()
    return df.rename({"neutral": "num_games"}, axis="columns")


def write_to_csv(df):
    df.to_csv("data/world_cup.csv")


write_to_csv(process_graph_2("data/football.csv"))
