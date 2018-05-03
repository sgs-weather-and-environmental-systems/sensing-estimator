# mmWave Sensing Estimator

This is the TI Gallery APP for calculating chirp configuration based on scene parameters.  It enables rapid prototyping of the chirp through real-time feedback of the chirp configuration and out of bounds checking.

See the Release Note section below for latest capabilities.


## Getting Started

**<a href="app/mmwave_sensing_estimator_qsg.pdf" target="_blank">Step-by-Step Quick Start Guide</a>**

mmWave Sensing Estimator comes with sensible default start values for various usecases.  Selecting one will generate a valid chirp configuration for the available devices.

Starting from the default values, the Assumptions and Inputs can be adjusted to your application.  Output and Chirp Design values will adjust in real-time based on your inputs.

If any parameters are out of bounds for the selected device, the parameters will be highlighted in red.  An error and tips for adjusting will be shown in the output box.

The Estimator provides convenient capability to save the parameters and reload them from local storage.  This will enable you to save your work and reload in the future when you continue your chirp design.

For explanation of each parameter, please see the User's Guide.
 
## Known issues
* Some input combinations can generate a negative chirp time. This is an invalid configuration. 

## Release Notes

### Version 1.2

* Added chirp diagram for easier visualization of the chirp configuration parameters
* Enabled inputs directly through URL
 * For example: dev.ti.com/mmWaveSensingEstimator?range=20&velocity=25
* Added download link for offline version inside the Sensing Estimator
* Organized the Sensing Estimator output view into front-end input parameters and information only parameters
* Renamed front-end input parameters to match Radar Studio
* Fixed bugs:
 * Sensing Estimator uses incorrect I/F bandwidth and Sample Rate for AWR1443
 * Inconsistent detectable range calculation in Sensing Estimator for Custom RCS

### Version 1.1

* Improved calculation of Idle Time and ADC Valid Start Time to find the optimum value for the input parameters.  This significantly improves max velocity and offer more valid chirp parameters.
* Fixed a bug in the active frame time calculation that was resulting in too high of active frame time.
* Fixed the check for maximum measurement rate by checking against 100% duty cycle instead of 50%.  Device is capable of 100% duty cycle, but attention should be paid to the head dissipation design.
* Improved memory checking to validate against production device memory where firmware is stored in ROM instead of RAM - increasing available memory by 128KB.
* Adjusted Transmit/Receive Antenna Gain to match EVM @ 9 dB.
* Adjusted Detection Loss default to 1 dB.

### Version 1.0

* Initial web-release of the mmWave Sensing Estimator
* Implemented basic scene parameters to chirp configuration conversion based on radar range equations
* Implemented out of bounds checking based on device capabilities