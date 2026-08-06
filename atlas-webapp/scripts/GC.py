import csv
import argparse
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from models import GenCor   # your SQLAlchemy model

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
            # print("Insert:", row)
            try:
                gc = GenCor(
                    id1=int(row["id1"]),
                    id2=int(row["id2"]),
                    rg=to_float(row["rg"]),
                    se=to_float(row["se"]),
                    z=to_float(row["z"]),
                    p=to_float(row["p"]),
                    gcov_int=to_float(row["gcov_int"]),
                    gcov_int_se=to_float(row["gcov_int_se"])
                    
                )
            except Exception as e:
                print(f"Error processing row {row}: {e}")
                continue

            session.add(gc)

    session.commit()

    print("Finished")

    session.close()


if __name__ == "__main__":
    main()