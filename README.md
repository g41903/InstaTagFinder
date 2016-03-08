# Instagram Tag Finder

This script helps you to download locally the latest pictures related to a specific Instagram hashtag.
It will fetch them and add them in a daily folder (like `2013-8-16` for the 16th of August 2013).

No resume feature.
No extra metadata.
No OAuth pain.

Only need the hastag and the number of pages you want to download!!

## Install

You need to clone this Gist and install at least [CasperJS 1.1](http://docs.casperjs.org/en/latest/installation.html).

```bash
brew update
brew install casperjs --devel

git clone https://github.com/100306087/InstaTagFinder.git
```

## Usage

```bash
cd instagram-hashtag-gist

# Downloading the 200 pages of latest pictures of andorra from iconosquare.com

casperjs scrolldownpage2.js andorra 200 --ssl-protocal=any

casperjs locationScraper.js andorra 200 --ssl-protocal=any

```

## Sample Output

```

/SimpleScraper/
  ├── 2012-7-14
  │   ├── 20d3e07acd9611e1b31022000a1d03a8_7.jpg
  │   └── 27d48126cd9711e1a98b22000a1e879e_7.jpg
  ├── 2012-7-8
  │   └── 19ba6698c8ef11e1985822000a1d011d_7.jpg
  ├── 2013-4-22
  │   └── 425da056ab3e11e28b3722000a1f99d9_7.jpg
  ├── 2013-6-11
  │   └── b1365f08d2d111e2aea022000a9d0ee7_7.jpg
  └── 2013-7-13
      ├── 607ac52aeb8811e2be0d22000a9f14df_7.jpg
      ├── 68742bfaebd711e2974122000a9e2969_7.jpg
      ├── cf24dfb8ebbc11e28cf922000a1fbaf5_7.jpg
      ├── d75cdb0aebbb11e2b39c22000a1f8adc_7.jpg
      └── ef0e89eceb9811e2b83c22000a9e184f_7.jpg
  ```
