
## Warning

It's time and disk consuming:

- 4 hours to download the whole dataset
- 320Gb of uncompressed data
- 4 hours to decompress
- 10 hours to simplify the structure and filter out English and Dutch data
- 15 Gb of cleaned NDJSON
- 37 million records
- 40 Gb database
- 12 hours to load into MSSQL

## Download 
[The weekly data dumps can be found here](<https://dumps.wikimedia.org/wikidatawiki/entities/>). Download the bz2 format, it's the smallest one. By clicking on [this link](https://dumps.wikimedia.org/wikidatawiki/entities/latest-all.json.bz2) you can download immediately the latest one. This results in a **16Gb** zipped [NDJson](http://ndjson.org) file 

## Decompress

To decompress you can use [7-zip on Windows](http://www.7-zip.org/download.html) or [bunzip2](http://gnuwin32.sourceforge.net/packages/bzip2.htm) while on MacOS the `bzip2` and `bunzip2` utilities are [part of the OS](http://osxdaily.com/2012/05/29/create-extract-bz2-mac-os-x/). 

    bunzip2 all-latest.json.bz2

## Clean

There are various utilities to manipulate the data. The easiest is probably the [wikidata-filter](https://github.com/maxlath/wikidata-filter/blob/master/docs/how_to.md) package for NodeJS. 

To filter out the English and Dutch data as well as [simplifying the structure](https://github.com/maxlath/wikidata-sdk/blob/master/docs/simplify_entities_data.md#simplify-entity) use:

    cat latest-all.json | wikidata-filter --languages en,nl --simplified > wikipandora.ndjson

on Mac and 

    type latest-all.json | wikidata-filter --languages en,nl --simplified > wikipandora.ndjson
    
on Windows. This takes **up to 10 hours** and results in a **15Gb** file.

## MSSQL 

Use the following script to create the database and a table

        CREATE DATABASE Wikidata
        GO
        
        CREATE TABLE [dbo].[Documents](
            [Id] [varchar](100) NOT NULL,
            [Type] [varchar](100) NOT NULL,
            [Labels] [nvarchar](4000) NOT NULL,
            [Document] [nvarchar](max) NOT NULL,
         CONSTRAINT [PK_Documents] PRIMARY KEY CLUSTERED 
         (
            [Id] ASC
         ) WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF,  
            IGNORE_DUP_KEY = OFF, 
            ALLOW_ROW_LOCKS = ON,  
            ALLOW_PAGE_LOCKS = ON) 
          ON [PRIMARY]
        )  
        GO

## Import

The code is straightforward:

- read a line of NDJSON
- remove the trailing ',' which gives a single JSON blob
- capture the field you need 
- insert into the SQL table

A typical run looks like 

    node import.js './yourbigfile.json' 0 2000

which imports the first 2K items. If you want to load everything use

    node import.js './yourbigfile.json' 0 null


Note that a parallel import is probably faster but that some congestion can occur and you need to deal with blocks.     




