## Notes
* Please do download the files from [GDrive](https://drive.google.com/file/d/1PZWGKE0XpB2Jjr_7LT8dKYTbZe2rL_62/view?usp=sharing) and extract them to `osrm/` directory firstly.

### How to run
1. Install docker on your system.
2. Go to the `osrm/` directory and run OSRM's docker container:
    1. If you want to process Netherlands' OSRM files on your own:
        1. Download `.osm` file of Netherlands: `curl -O http://download.geofabrik.de/europe/netherlands-latest.osm.pbf`
        2. Run `docker run -t -v $(pwd):/data osrm/osrm-backend:v5.22.0 osrm-extract -p /opt/car.lua /data/netherlands-latest.osm.pbf`
        3. Run `docker run -t -v $(pwd):/data osrm/osrm-backend:v5.22.0 osrm-contract /data/netherlands-latest.osrm`
        4. Run `docker run -t -i -p 5000:5000 -v $(pwd):/data osrm/osrm-backend:v5.22.0 osrm-routed /data/netherlands-latest.osrm`
    2. If you want to use already processed Nethelands' OSRM files:
        1. Go to `osrm` directory in project's root.
        2. Run `docker run -t -i -p 5000:5000 -v $(pwd):/data osrm/osrm-backend:v5.22.0 osrm-routed /data/netherlands-latest.osrm`
2. In the second terminal, install `nodejs` and `npm` on your system.
3. Install `@angular/cli` using `npm`.
5. Go to the `frontend/` directory and install `nodejs` dependencies using `npm install`.
6. Install _Angular's_ command line interface using `npm install -g @angular/cli`.
7. Start frontend using `npm start`.
8. In the third terminal, go to `python/` directory and install requirements using `pip install -r requirements.txt`.
9. Run _python_ backend using `python server.py`.
