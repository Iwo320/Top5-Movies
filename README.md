# Remotion video

<p align="center">
  <a href="https://github.com/remotion-dev/logo">
    <picture>
      <source media="(prefers-color-scheme: dark)" srcset="https://github.com/remotion-dev/logo/raw/main/animated-logo-banner-dark.gif">
      <img alt="Animated Remotion Logo" src="https://github.com/remotion-dev/logo/raw/main/animated-logo-banner-light.gif">
    </picture>
  </a>
</p>

Welcome to your Remotion project!

## Commands

**Install Dependencies**

```console
npm i
```

**Start Preview**

```console
npx remotion studio
```

**Render video**

```console
npx remotion render
```

## Free weekly automation

The workflow in `.github/workflows/weekly-video.yml` runs every Sunday and can also
be started manually. It uses the free local Piper TTS model with a Polish voice, so
it does not require ElevenLabs credits or an API key.

Add only `TMDB_API_KEY` under the repository's **Settings > Secrets and variables >
Actions**. The workflow downloads Piper, generates the voiceovers, renders the MP4,
and uploads it as a 30-day workflow artifact.

For local generation:

```console
python3 -m pip install --user piper-tts
python3 -m piper.download_voices pl_PL-gosia-medium --download-dir .piper
PIPER_MODEL="$PWD/.piper/pl_PL-gosia-medium.onnx" npm run generate
npm run generate:voiceovers
npm run render
```

**Upgrade Remotion**

```console
npx remotion upgrade
```

## Docs

Get started with Remotion by reading the [fundamentals page](https://www.remotion.dev/docs/the-fundamentals).

## Help

We provide help on our [Discord server](https://discord.gg/6VzzNDwUwV).

## Issues

Found an issue with Remotion? [File an issue here](https://github.com/JonnyBurger/remotion/issues/new).

## License

Note that for some entities a company license is needed. [Read the terms here](https://github.com/JonnyBurger/remotion/blob/main/LICENSE.md).
