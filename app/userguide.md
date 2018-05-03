## mmWave Sensing Estimator - User's Guide

mmWave Sensing Estimator is a simple-to-use, real-time calculator for estimating chirp configuration based on scene information.  It simplified radar theory and radar range equations into configurable inputs.  The estimator also provides error checking for out-of-bound inputs and out-of-bound device capabilities.

mmWave Sensing Estimator is divided into three - Inputs & Assumptions, Output Chirp Configuration, and Console.

**<a href="app/mmwave_sensing_estimator_qsg.pdf" target="_blank">Step-by-Step Quick Start Guide is available here.</a>**

### Inputs and Assumptions

In addition to the below inputs, the sensing estimator assumes maximum idle time of 7us and maximum ADC valid start time of 12.2us.

Sampling frequency is set to the minimum possible within device limit (>2Msps).

#### Device Specific Parameters

These parameters cover the basic selection of the device and antenna variants.

**mmWave Sensor** - Device variant selection from the mmWave sensing portfolio.  This field is used in error checking against device capabilities.

**# of Rx Antennas** - Number of antennas used on the receiving side of the front-end.  Higher antenna count results in less available data memory per chirp, but provides additional angular information.

**# of Tx Antennas** - Number of antennas used on the transmission side of the front-end.  Higher antenna count results in less available data memory per chirp, but provides additional angular information.

#### Board Specific Parameters

These parameters cover the board specific design related to the antenna design.  Default values match TI mmWave sensor EVMs.

**Transmit Antenna Gain** - Gain of the transmit antenna design.  8dB for TI mmWave sensor EVMs.

**Receive Antenna Gain** - Gain of the receive antenna design.  8dB for TI mmWave sensor EVMs.

#### Regulatory Restrictions

These parameters enable configuration for local regulatory restrictions and device operation.

**Frequency Range** - Selection of the supported frequency ranges the devices can operate in.

**Maximum Bandwidth** - Maximum allowable chirp bandwidth for a single chirp.  Value must be less than or equal to the bandwidth permitted by the **Frequency Range**.

**Transmit Power** - Maximum transmit device power allowed by the regulations.

#### Scene parameters

These parameters specify the typical scene the chirp should be designed to detect.  TI mmWave sensors are very configurable and can span a large number of different scenes.  In order to enable this flexibility, some parameters provide tradeoffs.  For example, Maximum Detectable Range will limit the Range Resolution. Out-of-bound error checking is provided based on the device capabilities.

**Ambient Temperature** - Typical ambient temperature where the sensor will be deployed.

**Maximum Detectable Range** - Maximum range where objects are still detectable by the chirp design.  Maximum range increase memory requirements and must be balanced against other Scene Parameters.

**Range Resolution** - Smallest distance two objects must be separate in the radial direction to appear as two objects. Smaller range resolution will increase memory requirements and the **Total Sweep Bandwidth**.

**Maximum Velocity** - Maximum detectable velocity of objects in the scene.  Larger maximum velocity will impact chirp **Ramp Slope**.

**Velocity Resolution** - Smallest difference in velocity of two objects to detect both objects individually with velocity only. Smaller velocity resolution will impact **Min # of Chirp Loops** and reduce maximum **Measurement Rate**.

**Measurement Rate** - Desired rate of measurement.  Measurement rate is limited by **Chirp Time** and **Active Frame Time**.

**Typical Detectable Object** - Radar cross section of a typical detectable object in the scene.  This value is used in calculating range of detection for this type of object within the **Maximum Detectable Range**.  Default values are provided for typical objects in a scene.

#### Additional Parameters

These parameters are the assumption around real-world operation where additional noise and signal loss may occur.

**Detection Loss** - Signal loss of the reflection signal from the object being detected.  Typically on the order of 1-3 dB.

**System Loss** - Signal loss due to mechanical design around the sensor.  Things like protective plastic, radome, and other protective can attribute signal loss.  Typically on the order of 1-2 dB.

**Implementation Margin** - Margin allocated for other system limitation that may be in the design.

**Detection SNR** - Minimum signal-to-noise ratio to detect object as valid reflection vs noise in the scene.  Typically on the order of 12-16 dB.

#### Save and Load Existing Scenes

mmWave Sensing Estimator provides capability to save your work to your local PC and reload at a future time.  

**Save Config** - Saves inputs to the local PC.

**Open Config** - Loads inputs from the local PC.

**Reset Config** - Resets inputs to the defaults.

### Outputs and Chirp Design

#### Detectable Object Range

These outputs provide the guidelines for maximum range of detection for **Typical Detectable Object** and minimum radar cross section (object size) at **Maximum Detectable Range**.

**Max Range for Typical Detectable Object** - maximum range where the **Typical Detectable Object** will still be detected.

**Min RCS Detectable at Max Range** - minimum radar cross section (object size and reflectivity to RF) that can be detected at the **Maximum Detectable Range**.

#### Chirp Configuration Parameters

These parameters specify the chirp configuration to work in the specified scene.  After it is designed here, the chirp can be configured on the device through the use of mmWave SDK.  Please note that that these parameters only specify the front-end and additional processing may be required to achieve the scene parameters.

**Frequency Start** - Starting frequency of the chirp ramp.

**Frequency Slope** - Slope of the chirp as it ramps frequency.  Frequency Slope must be equal to or less than 100 MHz/us.

**Frequency Slope Constant** - Register-level parameter to represent the Frequency Slope.

**Sampling Rate** - ADC sampling frequency of the I/F signal.  The frequency is limited by device variants within each family.  Reference is provided in the datasheet for each device.

**# of Samples per Chirp** - Number of ADC samples per chirp.

**# of Chirp Loops** - Minimum number of chirps per frame to meet scene requirements.

**Frame Periodicity** - Total time from start of one frame to the start of the next frame.

**Idle Time** - Minimum idle time required between chirps.

**ADC Valid Start Time** - Time from the start of the ADC sampling until valid samples are available.  Impacts set up time of the chirp.

**Ramp End Time** - Ending time of each ramp from start at 0 - equivalent to total chirp time that includes chirp time and set up time.

#### Information Only Parameters

**Bandwidth** - Total chirp bandwidth including ADC start up and ramp down.

**Beat Frequency** - Beat frequency is the difference between the original ramp signal and the echo reflection from the detected object.

**Chirp Cycle Time** - Total duration of a single continuous chirp including set up and idle times.

**Chirp Repetition Period** - Period of how often the chirps are repeated for each TX in a frame.

**Active Frame Time** - Total frame time required for the **Maximum Velocity** and **Velocity Resolution**.

**# of Range FFT Bins** - Number of FFT bins required for the **Maximum Detectable Range** and **Range Resolution**.  Must be a power of 2.

**# of Doppler FFT Bins** - Number of FFT bins required for the **Maximum Velocity** and **Velocity Resolution**.  Must be a power of 2.

**Range Interbin Resolution** - Actual range resolution based on the "# of Range FFT Bins".  This value may be better than original "Range Resolution" due to increased FFT size to meet power of 2 requirement.

**Velocity Interbin Resolution** - Actual velocity resolution based on the "# of Doppler FFT Bins".  This value may be better than original "Velocity Resolution" due to increased FFT size to meet power of 2 requirement.

**Radar Cube Size** - Memory required for the radar data storage. Each device has different memory limitations.  To analyze front-end only, please select xR1243 in the **mmWave Sensor**.

### Console

The console provides real-time feedback based on the inputs.  In addition to highlighting out-of-bounds parameters, it also provides explanation of the errors and helpful hints on how to adjust the inputs.
