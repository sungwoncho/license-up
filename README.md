# license-up

[![Build Status](https://travis-ci.org/sungwoncho/license-up.svg?branch=master)](https://travis-ci.org/sungwoncho/license-up)

Update outdated license files in your github repos from command line.

![](https://cldup.com/k92SO6TYNk.gif)


## Installation

    npm install -g license-up


## Usage

In your command line:

    license-up --token [INSERT_YOUR_PERSONAL_ACCESS_TOKEN]

You can easily obtain a personal access token in your settings. Read
[this](https://github.com/blog/1509-personal-api-tokens) for more info.


## Why

Every year, your projects' licenses become obsolete.

On January 1, 2016, the following license file is out-of-date:

```md
Copyright (c) 2015 Sung Won Cho

Permission is hereby granted, free of charge, to any person
...
```

It should be updated to:

```md
Copyright (c) 2015-2016 Sung Won Cho

Permission is hereby granted, free of charge, to any person
...
```

Such a process becomes a hassle if you maintain multiple projects.

license-up solves that problem by automating the process using your
command line.


## How it works

* It goes through all your owned repos one by one, and looks for an outdated
license file.

* It *always* asks you for a confirmation before updating the license file.

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

* If it detects a range of years of which the last part is outdated, it updates
the last part.

e.g.

`Copyright (c) 2012-2015` becomes `Copyright (c) 2012-2016`
`Copyright (c) 2012 - 2015` becomes `Copyright (c) 2012 - 2016`
`Copyright (c) 2012 ~ 2015` becomes `Copyright (c) 2012 ~ 2016`


## Supported license formats

license-up was tested on [MIT license](https://opensource.org/licenses/MIT). It
might not work correctly with other types of licenses. Use with care.


## License

MIT
