# Daemon for MediaViewer

This is a small daemon that creates thumbs and previews for MediaViewer.

This [article](https://www.digitalocean.com/community/tutorials/how-to-write-a-linux-daemon-with-node-js-on-a-vps) helped me a lot.

### Requirements

* nix system
* nodejs 5.x
* git

### Run

1. `git clone https://github.com/raqystyle/mediaViewerDaemon.git`
2. `cd mediaViewerDaemon`
3. `mkdir ./logs`
4. `vim ./user_config.json` and paste the following in it:

	```json
	{
	  "outputDir": "/Users/ivandemchenko/testMediaDaemonRes",
	  "srcPaths": [
			"/Users/.../testMediaDaemon"
		]
	}
	```

5. `./bin/media-view-daemon`, it will start indexing you `processDirs` into `cacheRootDir`

### Stop

`ps -axf | grep [m]edia-view-daemon | awk '{ print "pid:"$2", parent-pid:"$3 }'`

the output might be

```bash
$> ps -aux | grep media-view-daemon | awk '{ print "pid:"$2", parent-pid:"$3 }'
pid:33811, parent-pid:1
pid:33842, parent-pid:33811
```

`kill -TERM 33811`
