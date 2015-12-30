# Daemon for MediaViewer

This is a small daemon that creates thumbs and previews for MediaViewer.

This [article](https://www.digitalocean.com/community/tutorials/how-to-write-a-linux-daemon-with-node-js-on-a-vps) helped me a lot.

### Requirements

* nix system
* nodejs 5.x

### Run

Create a file `user_config.json` with the following content:

```json
{
  "cacheRootDir": "/home/you/mv_cache",
  "processingPause": 500,
  "processDirs": [
    "/home/you/Pictures"
  ]
}
```

and then run `./bin/media-view-daemon`, it will start indexing you `processDirs`
into `cacheRootDir`

### Stop

`ps -axf | grep [m]edia-view-daemon | awk '{ print "pid:"$2", parent-pid:"$3 }'`

the output might be

```
$> ps -axf | grep [m]edia-view-daemon | awk '{ print "pid:"$2", parent-pid:"$3 }'
pid:33811, parent-pid:1
pid:33842, parent-pid:33811
```

`kill -TERM 33811`
