Run these commands

### Get image for parsing pdf
```
docker pull downloads.unstructured.io/unstructured-io/unstructured:latest
```

### Create continer and Map the container to the current directory
Run it while in the pdf_parser directory 
```
docker run -dt --name unstructured -v "$(pwd)":/path/in/container -w /path/in/container downloads.unstructured.io/unstructured-io/unstructured:latest
```


### this will drop you into a bash shell with root privileges where the Docker image is running
```
docker exec -u root -it unstructured bash
```


### Examle code when you are in the continaer
```
# this will drop you into a python console so you can run the below partition functions
python3

>>> from unstructured.partition.pdf import partition_pdf
>>> elements_pdf = partition_pdf(filename="recipe.pdf")

>>> from unstructured.partition.text import partition_text
>>> elements_txt = partition_text(filename="random.txt")

>>> print("\n\n".join([str(el) for el in elements_pdf]))
>>> print("\n\n".join([str(el) for el in elements_txt]))
```
