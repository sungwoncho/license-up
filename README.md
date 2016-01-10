# github-license-updater

Update all your project's license files to use the latest year using a
command line.


## Why

Every year, your projects' licenses become obsolete.

On January 1, 2016, the following license file is out-of-date:

```md
The MIT License (MIT)

Copyright (c) 2015 Sung Won Cho

Permission is hereby granted, free of charge, to any person
obtaining a copy of this software and associated documentation
...
```

It should be updated to:

```md
The MIT License (MIT)

Copyright (c) 2015-2016 Sung Won Cho

Permission is hereby granted, free of charge, to any person
obtaining a copy of this software and associated documentation
...
```

Such process becomes a hassle if you maintain multiple projects.

github-license-updater solves that problem by automating the process using your
command line.


## Installation

    npm install -g github-license-updater


## How it works

* It always asks you for a confirmation before making any updates.

e.g.

```
######### Repo: your-project #########
The license is out-of-date
Let's update Copyright (c) 2012 to Copyright (c) 2012-2016
[?] update the license [y/N]
```

* If it detects a single year that is outdated, it concatenates a hyphen
followed by the current year.

e.g.

`Copyright (c) 2012` becomes `Copyright (c) 2012-2016`

* If it detects a range of years and the last part is outdated, it updates the
last part.

e.g.

`Copyright (c) 2012-2015` becomes `Copyright (c) 2012-2016`
`Copyright (c) 2012 - 2015` becomes `Copyright (c) 2012 - 2016`
`Copyright (c) 2012 ~ 2015` becomes `Copyright (c) 2012 ~ 2016`


## Work in progress

It is work in progress. Currently it only works with MIT licenses, and the
license has to be named `LICENSE`. Working on improving it.


## License

MIT
