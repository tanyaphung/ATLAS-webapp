import csv
import argparse
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from models import GWASDB   # your SQLAlchemy model

def to_float(value):
    if value == "" or value is None:
        return None
    return float(value)

def main():

    parser = argparse.ArgumentParser()
    parser.add_argument("--csv", required=True)
    parser.add_argument("--host", default="mysql")
    parser.add_argument("--user", required=True)
    parser.add_argument("--password", required=True)
    parser.add_argument("--db", required=True)

    args = parser.parse_args()

    engine = create_engine(
        f"mysql+pymysql://{args.user}:{args.password}@{args.host}/{args.db}"
    )

    Session = sessionmaker(bind=engine)
    session = Session()


    with open(args.csv, newline="") as f:

        reader = csv.DictReader(f, delimiter="\t")

        for row in reader:

            print("Insert ID:", row["id"])

            gwas = GWASDB(
                id=int(row["id"]),
                PMID=row["PMID"],
                Year=int(row["Year"]),
                File=row["File"],
                Website=row["Website"],
                Consortium=row["Consortium"],
                Domain=row["Domain"],
                ChapterLevel=row["ChapterLevel"],
                SubchapterLevel=row["SubchapterLevel"],
                Trait=row["Trait"],
                uniqTrait=row["uniqTrait"],
                Population=row["Population"],
                Ncase=row["Ncase"],
                Ncontrol=row["Ncontrol"],
                N=row["N"],
                Genome=row["Genome"],
                Nsnps=int(row["Nsnps"]),
                Nhits=int(row["Nhits"]),
                SNPh2=to_float(row["SNPh2"]),
                SNPh2_se=to_float(row["SNPh2_se"]),
                SNPh2_z=to_float(row["SNPh2_z"]),
                SNPh2_l=to_float(row["SNPh2_l"]),
                SNPh2_l_se=to_float(row["SNPh2_l_se"]),
                LambdaGC=to_float(row["LambdaGC"]),
                Chi2=to_float(row["Chi2"]),
                Intercept=to_float(row["Intercept"]),
                Note=row["Note"],
                DateAdded=row["DateAdded"],
                DateLastModified=row["DateLastModified"]
                
            )

            session.add(gwas)

    session.commit()

    print("Finished")

    session.close()


if __name__ == "__main__":
    main()