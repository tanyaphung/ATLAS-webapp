from sqlalchemy import Column, Integer, String, Date, Float, create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

Base = declarative_base()

class GWASDB(Base):
    __tablename__ = "gwasDB"

    id = Column(Integer, primary_key=True)
    PMID = Column(String)
    Year = Column(Integer)
    File = Column(String)
    Website = Column(String)
    Consortium = Column(String)
    Domain = Column(String)
    ChapterLevel = Column(String)
    SubchapterLevel = Column(String)
    Trait = Column(String)
    uniqTrait = Column(String)
    Population = Column(String)
    Ncase = Column(String)
    Ncontrol = Column(String)
    N = Column(Integer)
    Genome = Column(String)
    Nsnps = Column(Integer)
    Nhits = Column(Integer)
    SNPh2 = Column(Float)
    SNPh2_se = Column(Float)
    SNPh2_z = Column(Float)
    SNPh2_l = Column(Float, nullable=True)
    SNPh2_l_se = Column(Float, nullable=True)
    LambdaGC = Column(Float)
    Chi2 = Column(Float)
    Intercept = Column(Float)
    Note = Column(String)
    DateAdded = Column(Date)
    DateLastModified = Column(Date)