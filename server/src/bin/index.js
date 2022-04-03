#! /usr/bin/env node

"use strict";
const inquirer = require("inquirer");
const { getAllEtfProviders } = require("../services/etfProviderService");
const { updateConfigs } = require("../services/countryConfigService");
const { updateSectorConfigs } = require("../services/sectorConfigService");

const taskInquirer = () => {
    inquirer
        .prompt([
            {
                type: "list",
                name: "task",
                message: "What do you want to do?",
                choices: [
                    {
                        name: "Add data",
                        disabled: "Not yet implemented",
                    },
                    "Update data",
                ],
            },
        ])
        .then((answers) => {
            if (answers.task === "Update data") updateDataInquirer();
        });
};

const updateDataInquirer = () => {
    inquirer
        .prompt([
            {
                type: "list",
                name: "updatechoice",
                message: "Which data do you want do update?",
                choices: ["Country Config", "Sector Config"],
            },
        ])
        .then((answers) => {
            if (answers.updatechoice === "Country Config") {
                updateCountryConfigInquirer();
            } else if (answers.updatechoice === "Sector Config") {
                updateSectorConfigInquirer();
            }
        });
};

const updateCountryConfigInquirer = async () => {
    let etfProviders = await getAllEtfProviders(true);
    etfProviders = etfProviders.sort((a, b) => {
        return a.name.localeCompare(b.name);
    });

    inquirer
        .prompt([
            {
                type: "list",
                name: "etfProviderChoice",
                message:
                    "For which etf provider you want to upgrade the country configs?",
                choices: etfProviders,
            },
        ])
        .then((answers) => {
            const etfProvider = etfProviders.find((etfProvider) => {
                return etfProvider.name === answers.etfProviderChoice;
            });
            updateCountryConfigs(etfProvider.id);
        });
};

const updateSectorConfigInquirer = async () => {
    let etfProviders = await getAllEtfProviders(true);
    etfProviders = etfProviders.sort((a, b) => {
        return a.name.localeCompare(b.name);
    });

    inquirer
        .prompt([
            {
                type: "list",
                name: "etfProviderChoice",
                message:
                    "For which etf provider you want to upgrade the sector configs?",
                choices: etfProviders,
            },
        ])
        .then((answers) => {
            const etfProvider = etfProviders.find((etfProvider) => {
                return etfProvider.name === answers.etfProviderChoice;
            });
            updateSectorConfigs(etfProvider.id);
        });
};

const updateCountryConfigs = async (etfProviderId) => {
    if (!etfProviderId) return;

    const numCreatedRecs = await updateConfigs(etfProviderId);
    console.log(
        numCreatedRecs,
        "new country configs where succesfully created."
    );
};

taskInquirer();
