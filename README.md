# pingoscope

<!-- PROJECT SHIELDS -->
[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![MIT License][license-shield]][license-url]

<!-- TABLE OF CONTENTS -->

<details open="open">
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
    <li><a href="#acknowledgements">Acknowledgements</a></li>
  </ol>
</details>

<!-- ABOUT THE PROJECT -->
## About The Project

The Pingoscope is a addon for a horizontal mounted telescope, it points the telescope to a target and follows the target.

### Built With

* [AA.js](https://github.com/onekiloparsec/AA.js)

<!-- GETTING STARTED -->
## Getting Started

### Installation

1. Clone the repo

   ```sh
   git clone https://github.com/Pingoin/pingoscope.git
   ```

2. Install NPM packages

   ```sh
   npm install
   ```

3. compile Source

   ```sh
   npm run build
   ```

#### Server Linux

1. modify paths in ``` pingoscope.service ```

2. copy File to folder

   ```sh
   sudo cp pingoscope.service /lib/systemd/system
   ```

3. Refresh Service List

   ```sh
    sudo systemctl daemon-reload
   ```

4. enable service

    ```sh
    sudo systemctl enable pingoscope
    ```

5. Start service

    ```sh
    sudo systemctl start pingoscope
    ```

<!-- USAGE EXAMPLES -->
## Usage

Connect the Stellarium-Telescope Plugin to port 10001.

<!-- ROADMAP -->
## Roadmap

See the [open issues](https://github.com/Pingoin/pingoscope/issues) for a list of proposed features (and known issues).

<!-- CONTRIBUTING -->
## Contributing

Contributions are what make the open source community such an amazing place to be learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

<!-- LICENSE -->
## License

Distributed under the MIT License. See `LICENSE` for more information.

<!-- CONTACT -->
## Contact

Project Link: [https://github.com/Pingoin/pingoscope](https://github.com/Pingoin/pingoscope)

<!-- ACKNOWLEDGEMENTS -->
## Acknowledgements

* [Img Shields](https://shields.io)
* [Choose an Open Source License](https://choosealicense.com)

<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->
[contributors-shield]: https://img.shields.io/github/contributors/Pingoin/pingoscope.svg?style=for-the-badge
[contributors-url]: https://github.com/Pingoin/pingoscope/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/Pingoin/pingoscope.svg?style=for-the-badge
[forks-url]: https://github.com/Pingoin/pingoscope/network/members
[stars-shield]: https://img.shields.io/github/stars/Pingoin/pingoscope.svg?style=for-the-badge
[stars-url]: https://github.com/Pingoin/pingoscope/stargazers
[issues-shield]: https://img.shields.io/github/issues/Pingoin/pingoscope.svg?style=for-the-badge
[issues-url]: https://github.com/Pingoin/pingoscope/issues
[license-shield]: https://img.shields.io/github/license/Pingoin/pingoscope?style=for-the-badge
[license-url]: https://github.com/Pingoin/pingoscope/blob/master/LICENSE.txt